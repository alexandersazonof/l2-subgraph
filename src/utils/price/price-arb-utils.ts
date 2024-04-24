import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts';
import {
  ARB,
  BD_18,
  BD_ONE, BD_TEN,
  BD_ZERO,
  BI_18,
  BI_TEN,
  CAMELOT_ETH_FARM_ARB,
  CAMELOT_FACTORY_ARB, checkBalancer,
  DEFAULT_DECIMAL,
  DEFAULT_IFARM_PRICE,
  DEFAULT_PRICE,
  GRAIL_ARB,
  IFARM_ARB,
  isArb,
  isBalancer,
  isBtc,
  isCamelot, isCamelotUniswapV3,
  isConvex,
  isCurve,
  isGammaVault,
  isLpUniPair, isMagpie,
  isMeshSwap,
  isPoisonFinanceToken,
  isStableCoin,
  isStablePool,
  isWeth,
  isWsteth, NULL_ADDRESS, PENDLE_ARB, PENDLE_LPT_ARB,
  RADIANT_ARB,
  SILO_ARB,
  SOLID_LIZARD_FACTORY_ARB,
  SUSHI_ETH_RADIANT_ARB,
  SUSHI_ETH_WSETH_ARB,
  SUSHI_SWAP_FACTORY_ARB, UNISWAP_V3_POISON_FINANCE_POOL_ARB,
  USDC_ARB,
  USDC_DECIMAL,
  WBTC_ARB,
  WETH_ARB,
  X_GRAIL_ARB,
} from '../constant';
import { CamelotPairContract } from '../../../generated/StorageListener/CamelotPairContract';
import { UniswapV2FactoryContract } from '../../../generated/StorageListener/UniswapV2FactoryContract';
import { UniswapV2PairContract } from '../../../generated/StorageListener/UniswapV2PairContract';
import { fetchContractDecimal } from '../token-utils';
import { pow, powBI } from '../number-utils';
import { LizardFactoryContract } from '../../../generated/StorageListener/LizardFactoryContract';
import { LizardPairContract } from '../../../generated/StorageListener/LizardPairContract';
import { CamelotFactoryContract } from '../../../generated/StorageListener/CamelotFactoryContract';
import { Token, Vault } from '../../../generated/schema';
import { ConvexPoolContract } from '../../../generated/StorageListener/ConvexPoolContract';
import { CurveVaultContract } from '../../../generated/StorageListener/CurveVaultContract';
import { CurveMinterContract } from '../../../generated/StorageListener/CurveMinterContract';
import { ERC20 } from '../../../generated/StorageListener/ERC20';
import { GammaVaultContract } from '../../../generated/StorageListener/GammaVaultContract';
import { WeightedPool2TokensContract } from '../../../generated/StorageListener/WeightedPool2TokensContract';
import { BalancerVaultContract } from '../../../generated/StorageListener/BalancerVaultContract';
import { MeshSwapContract } from '../../../generated/StorageListener/MeshSwapContract';
import { UniswapV3PoolContract } from '../../../generated/StorageListener/UniswapV3PoolContract';
import { MagpieAsset } from '../../../generated/StorageListener/MagpieAsset';
import { CamelotUniswapV3Vault } from '../../../generated/StorageListener/CamelotUniswapV3Vault';

export function getPriceForCoinArb(address: Address): BigInt {
  if (address.equals(IFARM_ARB)) {
    const price = getPriceForIFARM();
    return price.isZero() ? DEFAULT_IFARM_PRICE : price;
  }
  if (address.equals(RADIANT_ARB)) {
    return getPriceForRadiant(SUSHI_ETH_RADIANT_ARB);
  }
  if (address.equals(X_GRAIL_ARB)) {
    return getPriceForCamelot(GRAIL_ARB);
  }
  if (isWsteth(address)) {
    return getPriceForRadiant(SUSHI_ETH_WSETH_ARB);
  }
  if (isWeth(address)) {
    return getPriceForCoinWithSwap(WETH_ARB, USDC_ARB, SUSHI_SWAP_FACTORY_ARB)
  }
  if (address.equals(SILO_ARB)) {
    return getPriceForCamelot(address);
  }
  if (address.equals(PENDLE_LPT_ARB)) {
    return getPriceForCamelot(PENDLE_ARB);
  }
  if (isStableCoin(address.toHexString())) {
    return BI_18;
  }

  let price = getPriceForCoinWithSwap(address, USDC_ARB, SUSHI_SWAP_FACTORY_ARB)
  if (price.isZero()) {
    price = getPriceForCoinWithSwapLizard(address);
  }
  if (price.isZero()) {
    price = getPriceForCamelot(address);
  }
  return price;
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

function getPriceForCoinWithSwapLizard(address: Address): BigInt {
  if (isStableCoin(address.toHex())) {
    return BI_18
  }
  const uniswapFactoryContract = LizardFactoryContract.bind(SOLID_LIZARD_FACTORY_ARB)
  const tryGetPair = uniswapFactoryContract.try_getPair(USDC_ARB, address, false)
  if (tryGetPair.reverted) {
    return DEFAULT_PRICE
  }

  const poolAddress = tryGetPair.value

  const uniswapPairContract = LizardPairContract.bind(poolAddress);
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

function getPriceForCamelot(address: Address): BigInt {
  const camelotFactory = CamelotFactoryContract.bind(CAMELOT_FACTORY_ARB);
  const tryPair = camelotFactory.try_getPair(WETH_ARB, address);
  if (tryPair.reverted) {
    return BigInt.zero();
  }
  const pairAddress = tryPair.value;
  const camelotPairContract = CamelotPairContract.bind(pairAddress);
  const tryGetReserves = camelotPairContract.try_getReserves()
  if (tryGetReserves.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for ${pairAddress.toHexString()} , for address: ${address.toHexString()}`)

    return DEFAULT_PRICE
  }
  const reserves = tryGetReserves.value
  if (reserves.get_reserve0().isZero()) {
    log.log(log.Level.WARNING, `get_reserve0 is 0 for ${pairAddress.toHexString()} , for address: ${address.toHexString()}`)
    return BigInt.zero();
  }
  let result = reserves.get_reserve1().divDecimal(reserves.get_reserve0().toBigDecimal())
  if (camelotPairContract.token1().equals(WETH_ARB)) {
    result = reserves.get_reserve0().divDecimal(reserves.get_reserve1().toBigDecimal())
  }
  if (result.equals(BD_ZERO)) {
    log.log(log.Level.WARNING, `Result is 0 for ${pairAddress.toHexString()} , for address: ${address.toHexString()}`)
    return BigInt.zero();
  }
  const ethPrice = getPriceForCoinArb(WETH_ARB)
  return toBigInt(ethPrice.divDecimal(BD_18).div(result).times(BD_18));
}

function getPriceForRadiant(pool: Address): BigInt {
  const camelotPairContract = UniswapV2PairContract.bind(pool);
  const tryGetReserves = camelotPairContract.try_getReserves()
  if (tryGetReserves.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for ${SUSHI_ETH_RADIANT_ARB.toHex()}`)

    return DEFAULT_PRICE
  }
  const reserves = tryGetReserves.value
  const result = reserves.get_reserve1().divDecimal(reserves.get_reserve0().toBigDecimal())
  const ethPrice = getPriceForCoinArb(WETH_ARB)
  const price = ethPrice.divDecimal(BD_18).times(result);

  const val = price.times(BD_18).toString().split('.');
  if (val.length < 1) {
    return BigInt.zero();
  }
  return BigInt.fromString(val[0])
}

function getPriceForIFARM(): BigInt {
  const camelotPairContract = CamelotPairContract.bind(CAMELOT_ETH_FARM_ARB);
  const tryGetReserves = camelotPairContract.try_getReserves()
  if (tryGetReserves.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for ${CAMELOT_ETH_FARM_ARB.toHex()}`)

    return DEFAULT_PRICE
  }
  const reserves = tryGetReserves.value
  const result = reserves.get_reserve1().div(reserves.get_reserve0())
  const ethPrice = getPriceForCoinArb(WETH_ARB)
  return ethPrice.div(result);
}

export function getPriceByVaultArb(vault: Vault): BigDecimal {
  const underlyingAddress = vault.underlying



  const underlying = Token.load(underlyingAddress)
  if (underlying != null) {

    if (isStablePool(underlyingAddress)) {
      return BD_ONE;
    }

    if (isGammaVault(underlying.name, underlying.id)) {
      return getPriceGammaLpUniPair(underlying.id);
    }

    if (isLpUniPair(underlying.name)) {
      return getPriceLpUniPair(underlying.id);
    }

    if (isBtc(underlying.id)) {
      return getPriceForCoinArb(WBTC_ARB).divDecimal(BD_18);
    }

    if (isArb(underlying.id)) {
      return getPriceForCoinArb(ARB).divDecimal(BD_18);
    }

    if (isConvex(underlying.id)) {
      return getPriceForConvex(underlying.id).divDecimal(BD_18);
    }

    if (isPoisonFinanceToken(underlying.name)) {
      return getPriceForUniswapV3(UNISWAP_V3_POISON_FINANCE_POOL_ARB);
    }
    if (isBalancer(underlying.name)) {
      return getPriceForBalancer(underlying.id);
    }

    if (isCurve(underlying.name)) {
      const tempPrice = getPriceForCoinArb(Address.fromString(underlying.id))
      if (!tempPrice.isZero()) {
        return tempPrice.divDecimal(BD_18)
      }

      return getPriceForCurve(underlyingAddress);
    }

    if (isMeshSwap(underlying.name)) {
      return getPriceFotMeshSwap(underlyingAddress);
    }

    if (isCamelot(underlying.name)) {
      return getPriceCamelotUniPair(underlyingAddress);;
    }

    if (isCamelotUniswapV3(underlying.name, underlying.id)) {
      return getPriceForCamelotUniswapV3(vault);
    }

    if (isMagpie(underlying.name)) {
      return getPriceForMagpie(vault);
    }
  }

  let price = getPriceForCoinArb(Address.fromString(underlyingAddress))
  if (!price.isZero()) {
    return price.divDecimal(BD_18)
  }
  return BigDecimal.zero()
}


function getPriceForConvex(underlyingAddress: string): BigInt {
  const convex = ConvexPoolContract.bind(Address.fromString(underlyingAddress))
  const tryPrice = convex.try_lp_price();
  return tryPrice.reverted ? DEFAULT_PRICE : tryPrice.value;
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
    let tokenPrice = getPriceForCoinArb(token).toBigDecimal()
    if (tokenPrice == BigDecimal.zero()) {
      tokenPrice = getPriceForCurve(token.toHex())
    } else {
      tokenPrice = tokenPrice.div(BD_18)
    }
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

    return getPriceForCoinArb(Address.fromString(underlyingAddress)).divDecimal(BD_18)
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


  const token0Price = getPriceForCoinArb(token0)
  const token1Price = getPriceForCoinArb(token1)

  if (token0Price.isZero() || token1Price.isZero()) {
    log.log(log.Level.WARNING, `Some price is zero token0 ${token0.toHex()} = ${token0Price} , token1 ${token1.toHex()} = ${token1Price}`)
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

function getPriceGammaLpUniPair(underlyingAddress: string): BigDecimal {
  const gammaVault = GammaVaultContract.bind(Address.fromString(underlyingAddress))
  const tryGetTotalAmounts = gammaVault.try_getTotalAmounts()
  if (tryGetTotalAmounts.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for underlyingAddress = ${underlyingAddress}, try get price for coin`)

    return getPriceForCoinArb(Address.fromString(underlyingAddress)).divDecimal(BD_18)
  }
  const reserves = tryGetTotalAmounts.value
  const totalSupply = gammaVault.totalSupply()
  const positionFraction = BD_ONE.div(totalSupply.toBigDecimal().div(BD_18))

  const token0 = gammaVault.token0()
  const token1 = gammaVault.token1()

  const firstCoin = reserves.getTotal0().toBigDecimal().times(positionFraction)
    .div(pow(BD_TEN, fetchContractDecimal(token0).toI32()))
  const secondCoin = reserves.getTotal1().toBigDecimal().times(positionFraction)
    .div(pow(BD_TEN, fetchContractDecimal(token1).toI32()))


  const token0Price = getPriceForCoinArb(token0)
  const token1Price = getPriceForCoinArb(token1)

  if (token0Price.isZero() || token1Price.isZero()) {
    log.log(log.Level.WARNING, `Some price is zero token0 ${token0.toHex()} = ${token0Price} , token1 ${token1.toHex()} = ${token1Price}`)
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

function getPriceCamelotUniPair(underlyingAddress: string): BigDecimal {
  const uniswapV2Pair = CamelotPairContract.bind(Address.fromString(underlyingAddress))
  const tryGetReserves = uniswapV2Pair.try_getReserves()
  if (tryGetReserves.reverted) {
    log.log(log.Level.WARNING, `Can not get reserves for underlyingAddress = ${underlyingAddress}, try get price for coin`)

    return getPriceForCoinArb(Address.fromString(underlyingAddress)).divDecimal(BD_18)
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


  const token0Price = getPriceForCoinArb(token0)
  const token1Price = getPriceForCoinArb(token1)

  if (token0Price.isZero() || token1Price.isZero()) {
    log.log(log.Level.WARNING, `Some price is zero token0 ${token0.toHex()} = ${token0Price} , token1 ${token1.toHex()} = ${token1Price}`)
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

function getPriceForBalancer(underlying: string): BigDecimal {
  const balancer = WeightedPool2TokensContract.bind(Address.fromString(underlying))
  const poolId = balancer.getPoolId()
  const totalSupply = balancer.totalSupply()
  const vault = BalancerVaultContract.bind(balancer.getVault())
  const tokenInfo = vault.getPoolTokens(poolId)

  let price = BigDecimal.zero()
  for (let i=0;i<tokenInfo.getTokens().length;i++) {
    const tokenAddress = tokenInfo.getTokens()[i]
    const tryDecimals = ERC20.bind(tokenAddress).try_decimals()
    let decimal = DEFAULT_DECIMAL
    if (!tryDecimals.reverted) {
      decimal = tryDecimals.value
    }
    const balance = normalizePrecision(tokenInfo.getBalances()[i], BigInt.fromI32(decimal)).toBigDecimal()

    let tokenPrice = BD_ZERO;
    if (tokenAddress == Address.fromString(underlying)) {
      tokenPrice = BD_ONE;
    } else if (checkBalancer(tokenAddress)) {
      tokenPrice = getPriceForBalancer(tokenAddress.toHexString());
    } else {
      tokenPrice = getPriceForCoinArb(tokenAddress).divDecimal(BD_18)
    }

    price = price.plus(balance.times(tokenPrice))
  }

  if (price.le(BigDecimal.zero())) {
    return price
  }
  return price.div(totalSupply.toBigDecimal())
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


  const token0Price = getPriceForCoinArb(token0)
  const token1Price = getPriceForCoinArb(token1)

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

// example poison/usdt
function getPriceForUniswapV3(poolAddress: Address): BigDecimal {
  const pool =  UniswapV3PoolContract.bind(poolAddress)

  const trySlot0 = pool.try_slot0()

  if (trySlot0.reverted) {
    return BigDecimal.zero()
  }

  const sqrtPriceX96 = trySlot0.value.getSqrtPriceX96()

  const value = sqrtPriceX96.divDecimal(
    pow(BigDecimal.fromString('2'), 96)
  )

  const valueInPow = pow(value, 2)

  // TODO fix if you will you for other vaults
  // https://blog.uniswap.org/uniswap-v3-math-primer
  return valueInPow.times(pow(BD_TEN, 12))
}

function getPriceForMagpie(vault: Vault): BigDecimal {
  const asset =  MagpieAsset.bind(Address.fromString(vault.underlying))
  const tryUnderlyingToken = asset.try_underlyingToken()
  if (tryUnderlyingToken.reverted) {
    return BigDecimal.zero();
  }
  const price = getPriceForCoinArb(tryUnderlyingToken.value);
  if (price.isZero()) {
    return BigDecimal.zero();
  }
  let decimal = 18;
  const tryDecimal = asset.try_underlyingTokenDecimals();
  if (!tryDecimal.reverted) {
    decimal = tryDecimal.value;
  }

  return price.toBigDecimal().div(pow(BD_TEN, decimal));
}

// ((token0Balance * token0Price) + (token1Balance * token1Price)) / (liquidity / 10 ** 18)
function getPriceForCamelotUniswapV3(vault: Vault): BigDecimal {
  const vaultV3 = CamelotUniswapV3Vault.bind(Address.fromString(vault.underlying));
  const tryPool = vaultV3.try_pool()
  if (tryPool.reverted) {
    return BigDecimal.zero();
  }
  const poolAddress = tryPool.value
  if (!poolAddress.equals(NULL_ADDRESS)) {
    const pool =  UniswapV3PoolContract.bind(poolAddress)

    const liquidity = pool.liquidity()
    const token0 = ERC20.bind(pool.token0())
    const token1 = ERC20.bind(pool.token1())
    const balanceToken0 = token0.balanceOf(poolAddress)
    const balanceToken1 = token1.balanceOf(poolAddress)
    const priceToken0 = getPriceForCoinArb(token0._address)
    const priceToken1 = getPriceForCoinArb(token1._address)
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

  return BigDecimal.zero()
}

function toBigInt(value: BigDecimal): BigInt {
  const val = value.toString().split('.');
  if (val.length < 1) {
    return BigInt.zero();
  }
  return BigInt.fromString(val[0])
}