import { UserBalance, UserBalanceHistory, Vault } from '../../generated/schema';
import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { VaultContract } from '../../generated/StorageListener/VaultContract';
import { pow } from '../utils/number-utils';
import { BD_TEN } from '../utils/constant';
import { ERC20 } from '../../generated/StorageListener/ERC20';

export function createUserBalance(vault: Vault, user: Address, isDeposit: boolean, timestamp: BigInt = BigInt.zero()): void {
  const vaultAddress = Address.fromString(vault.id);
  const vaultContract = VaultContract.bind(vaultAddress);
  let poolBalance = BigDecimal.zero()
  if (vault.pool != null) {
    const poolContract = ERC20.bind(Address.fromString(vault.pool!))
    const tryPoolBal = poolContract.try_balanceOf(user)
    poolBalance = tryPoolBal.reverted ? BigDecimal.zero() : tryPoolBal.value.divDecimal(pow(BD_TEN, vault.decimal))
  }
  const tryVaultBal = vaultContract.try_balanceOf(user)
  const vaultBalance = tryVaultBal.reverted ? BigDecimal.zero() : tryVaultBal.value.divDecimal(pow(BD_TEN, vault.decimal))
  const value = vaultBalance.plus(poolBalance)

  const userBalanceId = `${vault.id}-${user.toHex()}`
  let userBalance = UserBalance.load(userBalanceId)
  if (userBalance == null) {
    userBalance = new UserBalance(userBalanceId)
    userBalance.timestamp = timestamp
    userBalance.vault = vault.id
    userBalance.value = BigDecimal.zero()
    userBalance.userAddress = user.toHex()
  }
  userBalance.poolBalance = poolBalance
  userBalance.vaultBalance = vaultBalance
  userBalance.value = value

  userBalance.save()
  const userBalanceHistory = new UserBalanceHistory(`${timestamp}-${user.toHex()}`)
  userBalanceHistory.timestamp = timestamp
  userBalanceHistory.userAddress = user.toHex()
  userBalanceHistory.vault = vault.id
  userBalanceHistory.transactionType = isDeposit
    ? 'Deposit'
    : 'Withdraw'
  userBalanceHistory.value = userBalance.value
  userBalanceHistory.poolBalance = poolBalance
  userBalanceHistory.vaultBalance = vaultBalance
  userBalanceHistory.priceUnderlying = vault.priceUnderlying
  userBalanceHistory.sharePrice = vaultContract.getPricePerFullShare()
  userBalanceHistory.save()

  updateVaultUsers(vault, value, user.toHex());
}

function updateVaultUsers(vault: Vault, value: BigDecimal, userAddress: string): void {
  let users = vault.users;
  if (value.equals(BigDecimal.zero())) {
    let newUsers: string[] = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].toLowerCase() != userAddress.toLowerCase()) {
        newUsers.push(users[i])
      }
    }
    users = newUsers;
  } else {
    let hasUser = false;
    for (let i = 0; i < users.length; i++) {
      if (userAddress.toLowerCase() == users[i].toLowerCase()) {
        hasUser = true;
        break;
      }
    }

    if (!hasUser) {
      users.push(userAddress)
    }
  }
  vault.users = users;
  vault.save()
}