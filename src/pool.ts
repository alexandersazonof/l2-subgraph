import { log } from '@graphprotocol/graph-ts';
import { PotPoolContract, RewardAdded } from '../generated/StorageListener/PotPoolContract';
import { createReward } from './helpers/reward-helper';
import { getOrCreatePool } from './helpers/pool-helper';
import { createApyReward } from './helpers/apy-helper';

export function handleRewardAdded(event: RewardAdded): void {
  const pool = getOrCreatePool(event.address, event.block.timestamp);
  const poolAddress = event.address
  const rewardAmount = event.params.reward

  const poolContract = PotPoolContract.bind(poolAddress)
  const tryRewardToken = poolContract.try_rewardToken()
  const tryRewardRate = poolContract.try_rewardRate()
  const tryPeriodFinish = poolContract.try_periodFinish()

  if (tryPeriodFinish.reverted) {
    log.log(log.Level.WARNING, `Can not get periodFinish, handleRewardAdded on ${poolAddress}`)
  }

  if (tryRewardToken.reverted) {
    log.log(log.Level.WARNING, `Can not get rewardToken, handleRewardAdded on ${poolAddress}`)
  }

  if (tryRewardRate.reverted) {
    log.log(log.Level.WARNING, `Can not get rewardRate, handleRewardAdded on ${poolAddress}`)
  }

  createReward(pool, tryRewardToken.value, tryRewardRate.value, tryPeriodFinish.value, rewardAmount, event.block.timestamp);
  createApyReward(pool, event.block.timestamp);
}
