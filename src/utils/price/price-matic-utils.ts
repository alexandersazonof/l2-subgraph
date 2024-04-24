import { Address, BigDecimal, BigInt, dataSource, log } from '@graphprotocol/graph-ts';
import {
  AM_USD_BALANCER_MATIC,
  BALANCER_CONTRACT_NAME,
  BB_AM_USD_BALANCER_MATIC,
  BD_18,
  BD_ONE,
  BD_TEN,
  BD_ZERO,
  BI_18,
  BRZ_MATIC,
  CAVIAR_MATIC,
  CURVE_CONTRACT_NAME,
  DEFAULT_DECIMAL,
  DEFAULT_PRICE,
  F_UNI_V3_CONTRACT_NAME,
  FARM_TOKEN_MAINNET,
  FARM_TOKEN_MATIC,
  isAmUsd,
  isBalancer,
  isBrl,
  isCurve,
  isLpUniPair, isMeshSwap, isPar, isPearl, isQuickSwapUniV3,
  isStableCoin,
  isTetu,
  isWeth,
  JBRL_MATIC,
  LP_UNI_PAIR_CONTRACT_NAME,
  MATIC_NETWORK,
  MESH_SWAP_CONTRACT,
  NULL_ADDRESS,
  ORACLE_ADDRESS_MATIC,
  ORACLE_PRICE_TETU,
  PAR_MATIC,
  PAR_USDT_UNISWAP_V_3_MATIC,
  PEARL_CONTRACT_NAME,
  PEARL_MATIC,
  PEARL_ROUTER_MATIC,
  PS_ADDRESSES_MAINNET,
  PS_ADDRESSES_MATIC,
  QUICK_SWAP_CONTRACT,
  TETU_CONTRACT,
  USDC_MATIC,
  WETH_LIST_MATIC,
  WETH_MATIC,
} from '../constant';
import { OracleContract } from '../../../generated/StorageListener/OracleContract';
import { pow } from '../number-utils';
import { Token, Vault } from '../../../generated/schema';
import { TetuPriceCalculatorContract } from '../../../generated/StorageListener/TetuPriceCalculatorContract';
import { CurveVaultContract } from '../../../generated/StorageListener/CurveVaultContract';
import { CurveMinterContract } from '../../../generated/StorageListener/CurveMinterContract';
import { UniswapV2PairContract } from '../../../generated/StorageListener/UniswapV2PairContract';
import { ERC20 } from '../../../generated/StorageListener/ERC20';
import { fetchContractDecimal, fetchContractName } from '../token-utils';
import { WeightedPool2TokensContract } from '../../../generated/StorageListener/WeightedPool2TokensContract';
import { BalancerVaultContract } from '../../../generated/StorageListener/BalancerVaultContract';
import { MeshSwapContract } from '../../../generated/StorageListener/MeshSwapContract';
import { QuickSwapVaultContract } from '../../../generated/StorageListener/QuickSwapVaultContract';
import { QuickSwapPoolContract } from '../../../generated/StorageListener/QuickSwapPoolContract';
import { PearlPairContract } from '../../../generated/StorageListener/PearlPairContract';
import { PearlRouterContract } from '../../../generated/StorageListener/PearlRouterContract';
import { UniswapV3PoolContract } from '../../../generated/StorageListener/UniswapV3PoolContract';

export function getPriceForCoinMatic(reqAddress: Address): BigInt {
  if (isStableCoin(reqAddress.toHexString())) {
    return BI_18
  }
  let address = reqAddress
  if (isBrl(reqAddress.toHexString())) {
    address = BRZ_MATIC;
  }
  if (isWeth(reqAddress)) {
    address = WETH_MATIC;
  }
  const oracle = OracleContract.bind(ORACLE_ADDRESS_MATIC)
  let tryGetPrice = oracle.try_getPrice(address)
  if (tryGetPrice.reverted) {
    log.log(log.Level.WARNING, `Can not get price for address ${address.toHexString()}`)
    return DEFAULT_PRICE
  }
  return tryGetPrice.value;
}

export function getPriceByVaultMatic(vault: Vault): BigDecimal {

  if (isPsAddress(vault.id)) {
    return getPriceForCoinMatic(getFarmToken()).divDecimal(BD_18)
  }
  if (isAmUsd(Address.fromString(vault.id))) {
    return BD_ONE;
  }

  const underlyingAddress = vault.underlying

  if (underlyingAddress == CAVIAR_MATIC.toHexString().toLowerCase()) {
    return getPriceForCaviar()
  }

  const underlying = Token.load(underlyingAddress)
  if (underlying != null) {
    if (isLpUniPair(underlying.name)) {
      return getPriceLpUniPair(underlying.id);
    }

    if (isTetu(underlying.name)) {
      const tempPrice = getPriceForTetu(Address.fromString(underlying.id))
      return tempPrice;
    }

    if (isBalancer(underlying.name)) {
      const tempPrice = getPriceForBalancer(underlying.id)
      return tempPrice;
    }

    if (isCurve(underlying.name)) {
      const tempPrice = getPriceForCoinMatic(Address.fromString(underlying.id))
      if (!tempPrice.isZero()) {
        return tempPrice.divDecimal(BD_18)
      }

      const tempInPrice = getPriceForCurve(underlyingAddress)
      return tempInPrice;
    }

    if (isMeshSwap(underlying.name)) {
      const tempPrice = getPriceFotMeshSwap(underlyingAddress)
      return tempPrice;
    }

    if (isQuickSwapUniV3(underlying.name, Address.fromString(underlying.id))) {
      const tempPrice = getPriceForQuickSwapUniV3(Address.fromString(underlying.id))
      return tempPrice;
    }

    if (isPearl(underlying.name)) {
      const tempPrice = getPriceForPearlAssets(Address.fromString(underlying.id));
      return tempPrice;
    }
  }


  let price = getPriceForCoinMatic(Address.fromString(underlyingAddress))
  if (!price.isZero()) {
    return price.divDecimal(BD_18)
  }

  return BigDecimal.zero()

}

function getPriceForTetu(address: Address): BigDecimal {
  const price = TetuPriceCalculatorContract.bind(ORACLE_PRICE_TETU)
  let tryGetPrice = price.try_getPriceWithDefaultOutput(address)
  if (tryGetPrice.reverted) {
    log.log(log.Level.WARNING, `Can not get tetu price for address ${address.toHexString()}`)
    return BigDecimal.zero()
  }
  return tryGetPrice.value.divDecimal(BD_18)
}

function getPriceForCurve(underlyingAddress: string): BigDecimal {
  const curveContract = CurveVaultContract.bind(Address.fromString(underlyingAddress))
  const tryMinter = curveContract.try_minter()

  let minter = CurveMinterContract.bind(Address.fromString(underlyingAddress))
  if (!tryMinter.reverted) {
    minter = CurveMinterContract.bind(tryMinter.value)
  }

  let index = 0
  let tryCoins = minter.try_coins(BigInt.fromI32(index))
  while (!tryCoins.reverted) {
    const coin = tryCoins.value
    if (coin.equals(Address.zero())) {
      index = index - 1
      break
    }
    index = index + 1
    tryCoins = minter.try_coins(BigInt.fromI32(index))
  }
  const tryDecimals = curveContract.try_decimals()
  let decimal = DEFAULT_DECIMAL
  if (!tryDecimals.reverted) {
    decimal = tryDecimals.value.toI32()
  } else {
    log.log(log.Level.WARNING, `Can not get decimals for ${underlyingAddress}`)
  }
  const size = index + 1
  if (size < 1) {
    return BigDecimal.zero()
  }

  let value = BigDecimal.zero()

  for (let i=0;i<size;i++) {
    const index = BigInt.fromI32(i)
    const tryCoins1 = minter.try_coins(index)
    if (tryCoins1.reverted) {
      break
    }
    const token = tryCoins1.value
    const tokenPrice = getPriceForCoinMatic(token).divDecimal(BD_18)
    const balance = minter.balances(index)
    const tryDecimalsTemp = ERC20.bind(token).try_decimals()
    let decimalsTemp = DEFAULT_DECIMAL
    if (!tryDecimalsTemp.reverted) {
      decimalsTemp = tryDecimalsTemp.value
    } else {
      log.log(log.Level.WARNING, `Can not get decimals for ${token}`)
    }
    const tempBalance = balance.toBigDecimal().div(pow(BD_TEN, decimalsTemp))

    value = value.plus(tokenPrice.times(tempBalance))
  }
  return value.times(BD_18).div(curveContract.totalSupply().toBigDecimal())
}
// amount / (10 ^ 18 / 10 ^ decimal)
function normalizePrecision(amount: BigInt, decimal: BigInt): BigInt {
  return amount.div(BI_18.div(BigInt.fromI64(10 ** decimal.toI64())))
}

function getPriceLpUniPair(underlyingAddress: string): BigDecimal {
  const uniswapV2Pair = UniswapV2PairContract.bind(Address.fromString(underlyingAddress))
  const tryGetReserves = uniswapV2Pair.try_getReserves()
  if (tryGetReserves.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for underlyingAddress = ${underlyingAddress}, try get price for coin`)

    return getPriceForCoinMatic(Address.fromString(underlyingAddress)).divDecimal(BD_18)
  }
  const reserves = tryGetReserves.value
  const totalSupply = uniswapV2Pair.totalSupply()
  const positionFraction = BD_ONE.div(totalSupply.toBigDecimal().div(BD_18))

  const token0 = uniswapV2Pair.token0()
  const token1 = uniswapV2Pair.token1()

  const firstCoin = reserves.get_reserve0().toBigDecimal().times(positionFraction)
    .div(pow(BD_TEN, fetchContractDecimal(token0).toI32()))
  const secondCoin = reserves.get_reserve1().toBigDecimal().times(positionFraction)
    .div(pow(BD_TEN, fetchContractDecimal(token1).toI32()))


  const token0Price = getPriceForCoinMatic(token0)
  const token1Price = getPriceForCoinMatic(token1)

  if (token0Price.isZero() || token1Price.isZero()) {
    return BigDecimal.zero()
  }

  return token0Price
    .divDecimal(BD_18)
    .times(firstCoin)
    .plus(
      token1Price
        .divDecimal(BD_18)
        .times(secondCoin)
    )
}

function getPriceForBalancer(underlying: string, isTest: boolean = false): BigDecimal {
  if (NULL_ADDRESS.toHexString() == underlying) {
    return BigDecimal.zero();
  }
  const balancer = WeightedPool2TokensContract.bind(Address.fromString(underlying))
  const poolId = balancer.getPoolId()
  let totalSupply = balancer.totalSupply().divDecimal(BD_18)
  const vault = BalancerVaultContract.bind(balancer.getVault())
  const tokenInfo = vault.getPoolTokens(poolId)

  let price = BigDecimal.zero()
  let poolBalance = BigDecimal.zero();
  for (let i=0;i<tokenInfo.getTokens().length;i++) {
    const tokenAddress = tokenInfo.getTokens()[i]
    const name = fetchContractName(tokenAddress)
    const tryDecimals = ERC20.bind(tokenInfo.getTokens()[i]).try_decimals()
    let decimal = DEFAULT_DECIMAL
    if (!tryDecimals.reverted) {
      decimal = tryDecimals.value
    }
    // const balance = normalizePrecision(tokenInfo.getBalances()[i], BigInt.fromI32(decimal)).toBigDecimal()
    const balance = tokenInfo.getBalances()[i].divDecimal(pow(BD_TEN, decimal))

    let tokenPrice = BD_ZERO;

    if (tokenAddress == Address.fromString(underlying)) {
      tokenPrice = BD_ONE;
      poolBalance = balance;
    } else {
      if (!isTest && checkBalancer(tokenAddress)) {
        tokenPrice = getPriceForBalancer(tokenAddress.toHexString());
      } else if (isPar(tokenAddress)) {
        tokenPrice = getPriceForUniswapV3(PAR_USDT_UNISWAP_V_3_MATIC);
      } else {
        tokenPrice = getPriceForCoinMatic(tokenAddress).divDecimal(BD_18)
      }

      price = price.plus(balance.times(tokenPrice))
    }
  }

  if (price.le(BigDecimal.zero())) {
    return price
  }
  if (poolBalance.gt(BigDecimal.zero())) {
    totalSupply = totalSupply.minus(poolBalance);
  }
  return price.div(totalSupply)
}


function getPriceFotMeshSwap(underlyingAddress: string): BigDecimal {
  const meshSwap = MeshSwapContract.bind(Address.fromString(underlyingAddress))

  const tryReserve0 = meshSwap.try_reserve0()
  const tryReserve1 = meshSwap.try_reserve1()

  if (tryReserve0.reverted || tryReserve1.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for underlyingAddress = ${underlyingAddress}, try get price for coin`)

    return BigDecimal.zero()
  }

  const reserve0 = tryReserve0.value
  const reserve1 = tryReserve1.value
  const totalSupply = meshSwap.totalSupply()
  const token0 = meshSwap.token0()
  const token1 = meshSwap.token1()
  const positionFraction = BD_ONE.div(totalSupply.toBigDecimal().div(pow(BD_TEN, meshSwap.decimals())))

  const firstCoin = reserve0.toBigDecimal().times(positionFraction)
    .div(pow(BD_TEN, fetchContractDecimal(token0).toI32()))
  const secondCoin = reserve1.toBigDecimal().times(positionFraction)
    .div(pow(BD_TEN, fetchContractDecimal(token1).toI32()))


  const token0Price = getPriceForCoinMatic(token0)
  const token1Price = getPriceForCoinMatic(token1)

  if (token0Price.isZero() || token1Price.isZero()) {
    return BigDecimal.zero()
  }

  return token0Price
    .divDecimal(BD_18)
    .times(firstCoin)
    .plus(
      token1Price
        .divDecimal(BD_18)
        .times(secondCoin)
    )
}

export function getPriceForQuickSwapUniV3(address: Address): BigDecimal {

  const vault = QuickSwapVaultContract.bind(address)
  const tryPool = vault.try_pool()
  if (tryPool == null) {
    return BigDecimal.zero()
  }
  const poolAddress = tryPool.value

  const token0 = ERC20.bind(vault.token0())
  const token1 = ERC20.bind(vault.token1())
  const tryGetTotalAmounts = vault.try_getTotalAmounts();
  if (tryGetTotalAmounts.reverted) {
    return BigDecimal.zero()
  }
  const amount0 = tryGetTotalAmounts.value.value0;
  const amount1 = tryGetTotalAmounts.value.value1;
  const priceToken0 = getPriceForCoinMatic(token0._address)
  const priceToken1 = getPriceForCoinMatic(token1._address)
  if (priceToken0.isZero()
    || token0.decimals() == 0
    || token1.decimals() == 0
    || priceToken1.isZero()
    || amount0.isZero()
    || amount1.isZero()) {
    return BigDecimal.zero()
  }


  const balance = priceToken0.divDecimal(BD_18)
    .times(amount0.divDecimal(pow(BD_TEN, token0.decimals())))
    .plus(
      priceToken1.divDecimal(BD_18)
        .times(amount1.divDecimal(pow(BD_TEN, token1.decimals()))))

  const tryTS = vault.try_totalSupply()
  if (tryTS.reverted) {
    return BigDecimal.zero()
  }

  return balance.div(tryTS.value.divDecimal(BD_18))
}

function getPriceForPearlAssets(underlying: Address): BigDecimal {
  const pair = PearlPairContract.bind(underlying);

  const tryReserve0 = pair.try_reserve0()
  const tryReserve1 = pair.try_reserve1()

  if (tryReserve0.reverted || tryReserve1.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for underlyingAddress = ${underlying.toHexString()}, try get price for coin`)

    return BigDecimal.zero()
  }


  const reserve0 = tryReserve0.value
  const reserve1 = tryReserve1.value
  const totalSupply = pair.totalSupply()
  const token0 = pair.token0()
  const token1 = pair.token1()
  const positionFraction = BD_ONE.div(totalSupply.toBigDecimal().div(pow(BD_TEN, pair.decimals())))
  const decimal0 = fetchContractDecimal(token0)
  const decimal1 = fetchContractDecimal(token1)

  log.log(log.Level.INFO, `positionFraction = ${positionFraction}`);

  const firstCoin = reserve0.toBigDecimal()
    .div(pow(BD_TEN, decimal0.toI32()))
    .times(positionFraction)

  const secondCoin = reserve1.toBigDecimal()
    .div(pow(BD_TEN, decimal1.toI32()))
    .times(positionFraction)

  const token0Price = getPriceForCoinPearl(token0)
  const token1Price = getPriceForCoinPearl(token1)

  log.log(log.Level.INFO, `token0Price = ${token0Price}`)
  log.log(log.Level.INFO, `token1Price = ${token1Price}`)


  if (token0Price.equals(BigDecimal.zero()) || token1Price.equals(BigDecimal.zero())) {
    return BigDecimal.zero()
  }

  return token0Price
    .times(firstCoin)
    .plus(
      token1Price
        .times(secondCoin)
    )
}

function getPriceForCoinPearl(token: Address): BigDecimal {
  if (isStableCoin(token.toHexString().toLowerCase())) {
    return BigDecimal.fromString('1');
  }
  return getPriceForCoinPearlWithTokens(USDC_MATIC, token);
}

function getPriceForCaviar(): BigDecimal {
  const pearlPrice = getPriceForCoinPearlWithTokens(USDC_MATIC, PEARL_MATIC);
  const caviarPrice = getPriceForCoinPearlWithTokens(CAVIAR_MATIC, PEARL_MATIC);
  return pearlPrice.times(caviarPrice);
}

function getPriceForCoinPearlWithTokens(tokenA: Address, tokenB: Address): BigDecimal {
  if (isStableCoin(tokenB.toHexString())) {
    return BD_18;
  }

  if (tokenB.toHexString().toLowerCase() == CAVIAR_MATIC.toHexString().toLowerCase()) {
    return getPriceForCaviar()
  }
  const router = PearlRouterContract.bind(PEARL_ROUTER_MATIC);
  const tryPair = router.try_pairFor(tokenA, tokenB, false);
  if (tryPair.reverted) {
    return BigDecimal.zero();
  }
  const pair = PearlPairContract.bind(tryPair.value);

  const tryReserve0 = pair.try_reserve0()
  const tryReserve1 = pair.try_reserve1()
  if (tryReserve0.reverted || tryReserve1.reverted) {
    return BigDecimal.zero();
  }
  const decimal0 = fetchContractDecimal(tokenA);
  const decimal1 = fetchContractDecimal(tokenB);

  const tryToken0 = pair.try_token0();
  if (tryToken0.reverted) {
    return BigDecimal.zero();
  }

  let parsedDecimal0 = pow(BD_TEN, decimal0.toI32());
  let parsedDecimal1 = pow(BD_TEN, decimal1.toI32());


  let reserve0 = tryReserve0.value.divDecimal(parsedDecimal0)
  let reserve1 = tryReserve1.value.divDecimal(parsedDecimal1)


  if (!tokenA.equals(tryToken0.value)) {
    reserve0 = tryReserve0.value.divDecimal(parsedDecimal1)
    reserve1 = tryReserve1.value.divDecimal(parsedDecimal0)
    return reserve1.div(reserve0);
  }


  return reserve0.div(reserve1);
}

function getPriceForUniswapV3(poolAdr: Address): BigDecimal {
  const pool =  UniswapV3PoolContract.bind(poolAdr)

  const liquidity = pool.liquidity()
  const token0 = ERC20.bind(pool.token0())
  const token1 = ERC20.bind(pool.token1())
  const balanceToken0 = token0.balanceOf(poolAdr)
  const balanceToken1 = token1.balanceOf(poolAdr)
  const priceToken0 = getPriceForCoinMatic(token0._address)
  const priceToken1 = getPriceForCoinMatic(token1._address)
  if (priceToken0.isZero()
    || liquidity.isZero()
    || token0.decimals() == 0
    || token1.decimals() == 0
    || priceToken1.isZero()
    || balanceToken1.isZero()
    || balanceToken0.isZero()) {
    return BigDecimal.zero()
  }
  const balance = priceToken0.divDecimal(BD_18)
    .times(balanceToken0.divDecimal(pow(BD_TEN, token0.decimals())))
    .plus(
      priceToken1.divDecimal(BD_18)
        .times(balanceToken1.divDecimal(pow(BD_TEN, token1.decimals()))))

  let price = balance
    .div(liquidity.divDecimal(BD_18))

  return price;
}

function checkBalancer(address: Address): boolean {
  const contract = WeightedPool2TokensContract.bind(address);
  return !contract.try_getPoolId().reverted
}

function isPsAddress(address: string): boolean {
  if (dataSource.network() == 'mainnet') {
    return PS_ADDRESSES_MAINNET.join(' ').includes(address) == true
  } else if (dataSource.network() == MATIC_NETWORK) {
    return PS_ADDRESSES_MATIC.join(' ').includes(address) == true
  }
  return false
}

function getFarmToken(): Address {
  if (dataSource.network() == 'mainnet') {
    return FARM_TOKEN_MAINNET
  }
  if (dataSource.network() == MATIC_NETWORK) {
    return FARM_TOKEN_MATIC
  }
  return NULL_ADDRESS
}
