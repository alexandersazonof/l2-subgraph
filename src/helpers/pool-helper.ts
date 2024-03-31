import { Address, BigInt } from '@graphprotocol/graph-ts';
import { loadOrCreateToken } from './token-helper';
import { Pool } from '../../generated/schema';
import { PotPoolContract } from '../../generated/StorageListener/PotPoolContract';
import { PotPoolListener } from '../../generated/templates';
import { getOrCreateVault } from './vault-helper';
import { NULL_ADDRESS } from '../utils/constant';

const TYPE = 'PotPool'


export function getOrCreatePool(poolAddress: Address, timestamp: BigInt = BigInt.zero()): Pool {
  let pool = Pool.load(poolAddress.toHex())
  if (pool == null) {
    pool = new Pool(poolAddress.toHex());
    let poolContract = PotPoolContract.bind(poolAddress)
    let vaultAddress = poolContract.lpToken();

    pool.timestamp = timestamp
    pool.type = TYPE
    pool.vault = getOrCreateVault(vaultAddress.toHex()).id
    pool.save()
    PotPoolListener.create(poolAddress);
  }

  return pool;
}

export function isPool(address: Address): boolean {
  const pool = PotPoolContract.bind(address)
  return pool.try_lpToken().reverted == false
}

export function fetchRewardTokenLength(address: Address): BigInt {
  const pool = PotPoolContract.bind(address)
  const tryRewardTokenLength = pool.try_rewardTokensLength()
  return tryRewardTokenLength.reverted ? BigInt.fromI32(1) : tryRewardTokenLength.value
}

export function fetchRewardToken(address: Address, index: BigInt): Address {
  const pool = PotPoolContract.bind(address);
  const tryRewardToken = pool.try_rewardTokens(index)
  return tryRewardToken.reverted ? NULL_ADDRESS : tryRewardToken.value
}

export function fetchRewardRateForToken(address: Address, token: Address): BigInt {
  const pool = PotPoolContract.bind(address);
  const tryRewardRateForToken = pool.try_rewardRateForToken(token)
  return tryRewardRateForToken.reverted ? BigInt.zero() : tryRewardRateForToken.value
}

export function fetchPeriodFinishForToken(address: Address, token: Address): BigInt {
  const pool = PotPoolContract.bind(address);
  const tryRewardRateForToken = pool.try_periodFinishForToken(token)
  return tryRewardRateForToken.reverted ? BigInt.zero() : tryRewardRateForToken.value
}