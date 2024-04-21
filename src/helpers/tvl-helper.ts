import { TotalTvlCount, TotalTvlHistoryV2, TotalTvlUtil, Tvl, Vault } from '../../generated/schema';
import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts';
import { fetchContractTotalSupply } from '../utils/token-utils';
import { pow } from '../utils/number-utils';
import { BD_TEN, BD_ZERO, BI_EVERY_7_DAYS, CALCULATE_ONLY_TVL_MATIC, CONST_ID, MATIC_NETWORK } from '../utils/constant';
import { fetchPricePerFullShare } from '../utils/vault-utils';
import { getPriceByVault } from '../utils/price-utils';
import { getOrCreateVault } from './vault-helper';

export function createTvl(vault: Vault, timestamp: BigInt = BigInt.zero()): Tvl {
  const id = `${vault.id}-${timestamp.toString()}`
  const vaultAddress = Address.fromString(vault.id);
  let tvl = Tvl.load(id)
  if (tvl == null) {
    tvl = new Tvl(id);

    tvl.vault = vault.id
    tvl.timestamp = timestamp
    tvl.totalSupply = fetchContractTotalSupply(vaultAddress)

    const decimal = pow(BD_TEN, vault.decimal)
    tvl.sharePrice = fetchPricePerFullShare(vaultAddress)
    tvl.sharePriceDivDecimal = BigDecimal.fromString(tvl.sharePrice.toString()).div(decimal)
    tvl.decimal = decimal

    let price = vault.priceUnderlying;
    if (vault.priceUnderlying == BigDecimal.zero()) {
      price = getPriceByVault(vault);
    }
    tvl.priceUnderlying = price

    if (price.gt(BigDecimal.zero())) {
      tvl.value = tvl.totalSupply.toBigDecimal()
        .div(decimal)
        .times(price)
        .times(tvl.sharePriceDivDecimal)
    } else {
      tvl.value = BD_ZERO;
    }
    tvl.save();

    vault.tvl = tvl.value;
    vault.save();

    createTotalTvl(timestamp);
  }
  return tvl;
}

export function createTotalTvl(timestamp: BigInt): void {
  const tvlUtils = getTvlUtils(timestamp);
  // CREATE EVERY WEEK
  if (!(tvlUtils.lastTimestampUpdate.plus(BI_EVERY_7_DAYS) > timestamp || tvlUtils.lastTimestampUpdate.isZero())) {
    return;
  }
  let totalTvl = BigDecimal.zero()
  const array = tvlUtils.vaults
  for (let i = 0; i < array.length; i++) {
    const vault = getOrCreateVault(array[i]);
    if (canCalculateTotalTvl(vault.id)) {
      const tvl = vault.tvl
      totalTvl = totalTvl.plus(tvl)
    }
  }
  createTvlV2(totalTvl, timestamp);
  tvlUtils.lastTimestampUpdate = timestamp
  tvlUtils.save()
}

export function getTvlUtils(timestamp: BigInt = BigInt.zero()): TotalTvlUtil {
  let vaultUtils = TotalTvlUtil.load(CONST_ID);
  if (vaultUtils == null) {
    vaultUtils = new TotalTvlUtil(CONST_ID)
    vaultUtils.vaults = [];
    vaultUtils.lastTimestampUpdate = timestamp
    vaultUtils.timestamp = timestamp
    vaultUtils.save()
  }

  return vaultUtils;
}

export function createTvlV2(totalTvl: BigDecimal, timestamp: BigInt): TotalTvlHistoryV2 {
  let totalTvlHistory = TotalTvlHistoryV2.load(timestamp.toString())
  if (!totalTvlHistory) {
    totalTvlHistory = new TotalTvlHistoryV2(timestamp.toString())

    totalTvlHistory.sequenceId = totalTvlUp();
    totalTvlHistory.value = totalTvl
    totalTvlHistory.timestamp = timestamp
    totalTvlHistory.save()
  }
  return totalTvlHistory;
}

export function totalTvlUp(): BigInt {
  let totalCount = TotalTvlCount.load(CONST_ID)
  if (!totalCount) {
    totalCount = new TotalTvlCount(CONST_ID);
    totalCount.length = BigInt.zero();
  }

  totalCount.length = totalCount.length.plus(BigInt.fromString('1'));
  totalCount.save();
  return totalCount.length;
}


export function canCalculateTotalTvl(address: string): boolean {
  const network = dataSource.network();
  if (network == MATIC_NETWORK) {
    for (let i=0;i<CALCULATE_ONLY_TVL_MATIC.length;i++) {
      if (address.toLowerCase() == CALCULATE_ONLY_TVL_MATIC[i]) {
        return true;
      }
    }
    return false;
  }
  return true;
}