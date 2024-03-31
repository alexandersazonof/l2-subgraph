import { Address, BigDecimal, BigInt, dataSource } from '@graphprotocol/graph-ts';
import {
  ARBITRUM_NETWORK,
  BASE_NETWORK,
  MATIC_NETWORK,
} from './constant';
import { getPriceByVaultMatic, getPriceForCoinMatic } from './price/price-matic-utils';
import { getPriceByVaultArb, getPriceForCoinArb } from './price/price-arb-utils';
import { getPriceByVaultBase, getPriceForCoinBase } from './price/price-base-utils';
import { Vault } from '../../generated/schema';

export function getPriceForCoin(reqAddress: Address): BigInt {
  const network = dataSource.network();
  if (network == MATIC_NETWORK) {
    return getPriceForCoinMatic(reqAddress);
  } else if (network == ARBITRUM_NETWORK) {
    return getPriceForCoinArb(reqAddress);
  } else if (network == BASE_NETWORK) {
    return getPriceForCoinBase(reqAddress);
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
  }
  return BigDecimal.zero();
}
