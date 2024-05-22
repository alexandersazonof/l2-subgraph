import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { Vault, VaultUtil } from '../../generated/schema';
import { fetchContractDecimal, fetchContractName, fetchContractSymbol } from '../utils/token-utils';
import { fetchUnderlyingAddress } from '../utils/vault-utils';
import { loadOrCreateToken } from './token-helper';
import { VaultListener } from '../../generated/templates';
import { getTvlUtils } from './tvl-helper';

export function getOrCreateVault(id: string, timestamp: BigInt = BigInt.zero()): Vault {
  const vaultAddress = Address.fromString(id);
  let vault = Vault.load(id);
  if (vault == null) {
    vault = new Vault(id);
    vault.name = fetchContractName(vaultAddress)
    vault.decimal = fetchContractDecimal(vaultAddress).toI32()
    vault.symbol = fetchContractSymbol(vaultAddress)

    vault.underlying = loadOrCreateToken(fetchUnderlyingAddress(vaultAddress)).id

    vault.lastShareTimestamp = BigInt.zero()
    vault.lastSharePrice = BigInt.zero()
    vault.skipFirstApyReward = true
    vault.tvl = BigDecimal.zero()
    vault.priceUnderlying = BigDecimal.zero()
    vault.apyReward = BigDecimal.zero();
    vault.apy = BigDecimal.zero();
    vault.tvlSequenceId = 1;
    vault.apyAutoCompound = BigDecimal.zero();
    vault.users = [];
    vault.lastUsersShareTimestamp = BigInt.zero();

    vault.timestamp = timestamp;
    vault.save();
    VaultListener.create(vaultAddress);
    pushVault(vault.id);
  }
  return vault as Vault;
}

export function getVaultUtils(): VaultUtil {
  const id = '1';
  let vaultUtils = VaultUtil.load(id)
  if (!vaultUtils) {
    vaultUtils = new VaultUtil(id);
    vaultUtils.vaults = [];
    vaultUtils.vaultLength = 0;
    vaultUtils.lastBlockUpdate = 0;
    vaultUtils.save()
  }
  return vaultUtils;
}

export function pushVault(vaultId: string): void {
  const vaultUtils = getVaultUtils();
  const vaults = vaultUtils.vaults
  vaults.push(vaultId)
  vaultUtils.vaults = vaults;
  vaultUtils.vaultLength = vaults.length
  vaultUtils.save();

  const tvlUtils = getTvlUtils();
  tvlUtils.vaults = vaults;
  tvlUtils.save();
}