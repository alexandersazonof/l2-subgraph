import { getOrCreateVault } from './vault-helper';
import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts';
import { ApyAutoCompound, ApyReward, GeneralApy, Pool, Vault } from '../../generated/schema';
import {
  BD_18,
  BD_ONE,
  BD_ONE_HUNDRED,
  BD_ZERO,
  BIG_APY_BD,
  NULL_ADDRESS,
  SECONDS_OF_YEAR,
  YEAR_PERIOD,
} from '../utils/constant';
import { pow } from '../utils/number-utils';
import {
  fetchPeriodFinishForToken,
  fetchRewardRateForToken,
  fetchRewardToken,
  fetchRewardTokenLength,
} from './pool-helper';
import { getPriceForCoin } from '../utils/price-utils';

export function createApyAutoCompound(diffSharePrice: BigDecimal, diffTimestamp: BigInt, vault: Vault, timestamp: BigInt): ApyAutoCompound {
  const id = `${timestamp}-${vault.id}`;
  let apyAutoCompound = ApyAutoCompound.load(id)
  if (apyAutoCompound == null) {
    apyAutoCompound = new ApyAutoCompound(id)
    apyAutoCompound.timestamp = timestamp
    apyAutoCompound.apr = calculateAprAutoCompound(diffSharePrice, diffTimestamp.toBigDecimal())
    apyAutoCompound.apy = calculateApy(apyAutoCompound.apr)
    apyAutoCompound.vault = vault.id
    apyAutoCompound.diffSharePrice = diffSharePrice
    apyAutoCompound.diffTimestamp = diffTimestamp.toBigDecimal()

    if (apyAutoCompound.apy.le(BigDecimal.zero()) || apyAutoCompound.apy.gt(BIG_APY_BD)) {
      // don't save 0 APY && more 2000
      log.log(log.Level.ERROR, `Can not save APY < 0 OR APY > 1000 for vault ${vault.id}`)
    }
    apyAutoCompound.save();
    calculateGeneralApy(vault, timestamp);
  }
  return apyAutoCompound
}

export function createApyReward(
  pool: Pool,
  timestamp: BigInt,
): void {
  const poolAddress = Address.fromString(pool.id);
  let vault = getOrCreateVault(pool.vault)
  if (vault.skipFirstApyReward) {
    vault.skipFirstApyReward = false;
    vault.save();
    return;
  }
  let rewardRates: BigInt[] = []
  let periodFinishes: BigInt[] = []
  let rewardForPeriods: BigDecimal[] = []
  let prices: BigDecimal[] = []

  let apr = BigDecimal.zero()
  let apy = BigDecimal.zero()

  const tvlUsd = vault.tvl;

  // TODO can optimize
  const tokenLength = fetchRewardTokenLength(poolAddress)
  for (let i=0;i<tokenLength.toI32();i++) {
    const rewardToken = fetchRewardToken(poolAddress, BigInt.fromI32(i));
    if (rewardToken == NULL_ADDRESS) {
      continue;
    }
    // TODO can optimize
    const rewardRate = fetchRewardRateForToken(poolAddress, rewardToken);
    if (rewardRate == BigInt.zero()) {
      continue;
    }

    // TODO can optimize
    const periodFinish = fetchPeriodFinishForToken(poolAddress, rewardToken)
    if (periodFinish == BigInt.zero()) {
      continue;
    }
    const price = getPriceForCoin(rewardToken)
    const period = (periodFinish.minus(timestamp)).toBigDecimal()

    if (period.gt(BigDecimal.zero()) && price.gt(BigInt.zero())) {
      const priceBD = price.divDecimal(BD_18)
      const rewardForPeriod = rewardRate.divDecimal(BD_18).times(priceBD).times(period)

      rewardRates.push(rewardRate)
      periodFinishes.push(periodFinish)
      rewardForPeriods.push(rewardForPeriod)
      prices.push(priceBD)

      const aprTemp = calculateApr(period, rewardForPeriod, tvlUsd)
      const apyTemp = calculateApy(aprTemp)

      apr = apr.plus(aprTemp)
      apy = apy.plus(apyTemp)
    }
  }


  const apyReward = new ApyReward(`${timestamp}-${vault.id}`)

  apyReward.periodFinishes = periodFinishes
  apyReward.rewardRates = rewardRates
  apyReward.rewardForPeriods = rewardForPeriods
  apyReward.apr = apr
  apyReward.apy = apy
  apyReward.tvlUsd = tvlUsd
  apyReward.prices = prices

  if (apyReward.apy.le(BigDecimal.zero()) || apyReward.apy.gt(BIG_APY_BD)) {
    // don't save 0 APY
    return;
  }
  apyReward.vault = vault.id
  apyReward.timestamp = timestamp

  if (apyReward.apy.le(BigDecimal.zero()) || apyReward.apy.gt(BIG_APY_BD)) {
    // don't save 0 APY && more 2000
    log.log(log.Level.ERROR, `Can not save APY < 0 OR APY > 2000 for vault ${vault.id}`)
    return;
  }

  vault.apyReward = apy;
  vault.apy = vault.apyAutoCompound.plus(vault.apyReward)
  vault.save();
  calculateGeneralApy(vault, timestamp);
  apyReward.save()
}

export function calculateAprAutoCompound(diffSharePrice: BigDecimal, diffTimestamp: BigDecimal): BigDecimal {
  if (diffTimestamp.equals(BigDecimal.zero()) || diffTimestamp.equals(BigDecimal.zero())) {
    return BigDecimal.zero()
  }
  return diffSharePrice.div(diffTimestamp).times(BD_ONE_HUNDRED).times(SECONDS_OF_YEAR)
}

export function calculateGeneralApy(vault: Vault, timestamp: BigInt): void {
  const id = `${vault.id}-${timestamp}`;
  let generalApy = GeneralApy.load(id)
  if (!generalApy) {
    generalApy = new GeneralApy(id);
    generalApy.timestamp = timestamp;
    generalApy.apy = vault.apy;
    generalApy.vault = vault.id;
    generalApy.apyReward = vault.apyReward
    generalApy.apyAutoCompound = vault.apyAutoCompound
    generalApy.save();
  }
}

export function calculateApr(period: BigDecimal, reward: BigDecimal, tvl: BigDecimal): BigDecimal {
  if (BigDecimal.compare(BD_ZERO, tvl) == 0 || BigDecimal.compare(reward, BD_ZERO) == 0) {
    return BD_ZERO
  }
  const ratio = SECONDS_OF_YEAR.div(period);
  const tempValue = reward.div(tvl)
  return tempValue.times(ratio).times(BD_ONE_HUNDRED)
}

export function calculateApy(apr: BigDecimal): BigDecimal {
  if (BigDecimal.compare(BD_ZERO, apr) == 0) {
    return apr
  }
  let tempValue: BigDecimal = apr.div(BD_ONE_HUNDRED)
    .div(YEAR_PERIOD)
    .plus(BD_ONE);

  tempValue = pow(tempValue, 365)
  return tempValue
    .minus(BD_ONE)
    .times(BD_ONE_HUNDRED)
}