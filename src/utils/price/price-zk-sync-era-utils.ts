import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts';
import {
  BD_18,
  BI_18,
  BI_TEN, DEFAULT_DECIMAL,
  DEFAULT_PRICE,
  isStableCoin,
  SYNC_SWAP_FACTORY_ZK_SYNC_ERA,
  USDC_DECIMAL, USDC_ZK_SYNC_ERA,
} from '../constant';
import { UniswapV2FactoryContract } from '../../../generated/StorageListener/UniswapV2FactoryContract';
import { UniswapV2PairContract } from '../../../generated/StorageListener/UniswapV2PairContract';
import { fetchContractDecimal } from '../token-utils';
import { powBI } from '../number-utils';
import { Vault } from '../../../generated/schema';

export function getPriceForCoinZkSyncEra(address: Address): BigInt {
  let price = getPriceForCoinWithSwap(address, USDC_ZK_SYNC_ERA, SYNC_SWAP_FACTORY_ZK_SYNC_ERA)
  if (!price.isZero()) {
    return price;
  }
  return BigInt.fromI32(0);
}

export function getPriceByVaultZkSyncEra(vault: Vault): BigDecimal {
  return getPriceForCoinZkSyncEra(Address.fromString(vault.underlying)).divDecimal(BD_18);
}

function getPriceForCoinWithSwap(address: Address, stableCoin: Address, factory: Address): BigInt {
  if (isStableCoin(address.toHex())) {
    return BI_18
  }
  const uniswapFactoryContract = UniswapV2FactoryContract.bind(factory)
  const tryGetPair = uniswapFactoryContract.try_getPair(stableCoin, address)
  if (tryGetPair.reverted) {
    return DEFAULT_PRICE
  }

  const poolAddress = tryGetPair.value

  const uniswapPairContract = UniswapV2PairContract.bind(poolAddress);
  const tryGetReserves = uniswapPairContract.try_getReserves()
  if (tryGetReserves.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for ${poolAddress.toHex()}`)

    return DEFAULT_PRICE
  }
  const reserves = tryGetReserves.value
  const decimal = fetchContractDecimal(address)

  const delimiter = powBI(BI_TEN, decimal.toI32() - USDC_DECIMAL + DEFAULT_DECIMAL)

  return reserves.get_reserve1().times(delimiter).div(reserves.get_reserve0())
}