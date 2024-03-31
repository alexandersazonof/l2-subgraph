import { SharePriceChangeLog } from '../generated/ControllerContract/ControllerContract';
import { getOrCreateVault } from './helpers/vault-helper';
import { SharePrice, VaultHistory } from '../generated/schema';
import { BD_TEN, BI_TEN, TWO_WEEKS_IN_SECONDS } from './utils/constant';
import { pow, powBI } from './utils/number-utils';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { createUserBalance } from './helpers/users-helper';
import { createApyAutoCompound } from './helpers/apy-helper';

export function handleSharePriceChangeLog(event: SharePriceChangeLog): void {
  const vaultAddress = event.params.vault.toHexString();
  const vault = getOrCreateVault(vaultAddress, event.block.timestamp);
  const id = `${event.transaction.hash.toHex()}-${vaultAddress}`;
  let sharePrice = SharePrice.load(id);
  if (!sharePrice) {
    sharePrice = new SharePrice(id);
    sharePrice.vault = vault.id;
    sharePrice.oldSharePrice = event.params.oldSharePrice;
    sharePrice.newSharePrice = event.params.newSharePrice;
    sharePrice.timestamp = event.block.timestamp;
    sharePrice.save();
  }

  // VAULT HISTORY
  let vaultHistory = VaultHistory.load(id)
  if (!vaultHistory) {
    vaultHistory = new VaultHistory(id);
    vaultHistory.vault = vault.id;
    vaultHistory.sharePrice = vault.lastSharePrice;
    vaultHistory.sharePriceDec = vault.lastSharePrice.divDecimal(pow(BD_TEN, vault.decimal))
    vaultHistory.priceUnderlying = vault.priceUnderlying;
    vaultHistory.timestamp = event.block.timestamp;
    vaultHistory.save();
  }

  // APY AUTO COMPOUND
  const lastShareTimestamp = vault.lastShareTimestamp
  if (!lastShareTimestamp.isZero()) {
    let tempDiffSharePrice = sharePrice.newSharePrice.minus(sharePrice.oldSharePrice)
    if (tempDiffSharePrice.le(BigInt.zero())) {
      tempDiffSharePrice = powBI(BI_TEN, vault.decimal)
    }
    const diffSharePrice = tempDiffSharePrice.divDecimal(pow(BD_TEN, vault.decimal))
    const diffTimestamp = event.block.timestamp.minus(lastShareTimestamp)
    const apyAutoCompound = createApyAutoCompound(diffSharePrice, diffTimestamp, vault, event.block.timestamp);
    vault.apyAutoCompound = apyAutoCompound.apy;
    vault.apy = vault.apyAutoCompound.plus(vault.apyReward);
    vault.save();
  }

  // CALCULATE USER BALANCE
  if (vault.lastUsersShareTimestamp.plus(TWO_WEEKS_IN_SECONDS).lt(event.block.timestamp)) {
    const users = vault.users
    for (let i = 0; i < users.length; i++) {
      createUserBalance(vault, Address.fromString(users[i]), false, event.block.timestamp);
    }
    vault.lastUsersShareTimestamp = event.block.timestamp
  }

  vault.lastShareTimestamp = sharePrice.timestamp
  vault.lastSharePrice = sharePrice.newSharePrice
  vault.save()
}