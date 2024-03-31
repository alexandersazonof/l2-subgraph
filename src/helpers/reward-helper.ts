import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Pool, Reward } from '../../generated/schema';

export function createReward(
  pool: Pool,
  rewardToken: Address,
  rewardRate: BigInt,
  periodFinish: BigInt,
  rewardAmount: BigInt,
  timestamp: BigInt,
): void {
  let reward = new Reward(`${timestamp.toI32()}-${pool.id}-${rewardToken.toHex()}`)
  reward.timestamp = timestamp
  reward.pool = pool.id
  reward.token = rewardToken.toHex()
  reward.rewardRate = rewardRate
  reward.periodFinish = periodFinish
  reward.reward = rewardAmount
  reward.save()
}