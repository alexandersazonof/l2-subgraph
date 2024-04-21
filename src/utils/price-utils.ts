import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts';
import {
  ARBITRUM_NETWORK,
  BASE_NETWORK,
  MATIC_NETWORK, ZK_SYNC_ERA_NETWORK,
} from './constant';
import { getPriceByVaultMatic, getPriceForCoinMatic } from './price/price-matic-utils';
import { getPriceByVaultArb, getPriceForCoinArb } from './price/price-arb-utils';
import { getPriceByVaultBase, getPriceForCoinBase } from './price/price-base-utils';
import { Vault } from '../../generated/schema';
import { getPriceByVaultZkSyncEra, getPriceForCoinZkSyncEra } from './price/price-zk-sync-era-utils';

export function getPriceForCoin(reqAddress: Address): BigInt {
  const network = dataSource.network();
  if (network == MATIC_NETWORK) {
    return getPriceForCoinMatic(reqAddress);
  } else if (network == ARBITRUM_NETWORK) {
    return getPriceForCoinArb(reqAddress);
  } else if (network == BASE_NETWORK) {
    return getPriceForCoinBase(reqAddress);
  } else if (network == ZK_SYNC_ERA_NETWORK) {
    return getPriceForCoinZkSyncEra(reqAddress);
  }
  return BigInt.fromI32(0);
}

export function getPriceByVault(vault: Vault): BigDecimal {
  const network = dataSource.network();
  if (network == MATIC_NETWORK) {
    return getPriceByVaultMatic(vault);
  } else if (network == ARBITRUM_NETWORK) {
    return getPriceByVaultArb(vault);
  } else if (network == BASE_NETWORK) {
    return getPriceByVaultBase(vault);
  } else if (network == ZK_SYNC_ERA_NETWORK) {
    return getPriceByVaultZkSyncEra(vault);
  }
  return BigDecimal.zero();
}
