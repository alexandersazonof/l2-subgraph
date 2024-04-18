import { Address, BigDecimal, BigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { QuickSwapVaultContract } from '../../generated/StorageListener/QuickSwapVaultContract';
import { GammaVaultContract } from '../../generated/StorageListener/GammaVaultContract';
import { CamelotUniswapV3Vault } from '../../generated/StorageListener/CamelotUniswapV3Vault';
import { WeightedPool2TokensContract } from '../../generated/StorageListener/WeightedPool2TokensContract';

export const UNKNOWN = 'unknown';
export const NULL_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000');
export const DEFAULT_DECIMAL = 18;
export const BD_TEN = BigDecimal.fromString('10')
export const BD_ZERO = BigDecimal.fromString('0')
export const SECONDS_OF_YEAR = BigDecimal.fromString('31557600');
export const BD_ONE_HUNDRED = BigDecimal.fromString('100')
export const YEAR_PERIOD = BigDecimal.fromString('365')
export const BD_ONE = BigDecimal.fromString('1')
export const BD_18 = BigDecimal.fromString('1000000000000000000')
export const BIG_APY_BD = BigDecimal.fromString('1000');
export const TWO_WEEKS_IN_SECONDS = BigInt.fromString('1209600');
export const BI_TEN = BigInt.fromI64(10)
export const CONST_ID = '1';
export const BI_EVERY_7_DAYS = BigInt.fromString('604800');
export const BI_18 = BigInt.fromI64(10 ** 18)
export const DEFAULT_PRICE = BigInt.fromI32(0);
export const DEFAULT_IFARM_PRICE = BigInt.fromString('40000000000000000000')
export const USDC_DECIMAL = 6;

export const PS_ADDRESSES_MAINNET = [
  '0xd3093e3efbe00f010e8f5efe3f1cb5d9b7fe0eb1'.toLowerCase(),
  '0x8f5adC58b32D4e5Ca02EAC0E293D35855999436C'.toLowerCase(),
  '0xa0246c9032bc3a600820415ae600c6388619a14d'.toLowerCase(),
  '0x25550Cccbd68533Fa04bFD3e3AC4D09f9e00Fc50'.toLowerCase(),
  '0x59258F4e15A5fC74A7284055A8094F58108dbD4f'.toLowerCase(),
]

export const PS_ADDRESSES_MATIC = [
  '0xab0b2ddb9c7e440fac8e140a89c0dbcbf2d7bbff'.toLowerCase(),
]

export const STORAGE_MATIC = '0xc95CbE4ca30055c787CB784BE99D6a8494d0d197';
export const STORAGE_ARBITRUM = '0x88937abfc8C6A88cc70bfc686E4fBba80DE8d329';
export const STORAGE_BASE = '0x98E03c6Ed7374F1e58FF022f1D2D8239526E13F9';
export const STORAGE_ZK_SYNC_ERA = '0xA8B38fb4837c99f66f7b740b5EFfA4f15B9B2205';

export const ORACLE_ADDRESS_MATIC = Address.fromString('0x0E74303d0D18884Ce2CEb3670e72686645c4f38B');

export const FARM_TOKEN_MAINNET = Address.fromString('0xa0246c9032bc3a600820415ae600c6388619a14d')
export const FARM_TOKEN_MATIC = Address.fromString('0xab0b2ddb9c7e440fac8e140a89c0dbcbf2d7bbff')


export const AM_USD_BALANCER_MATIC = Address.fromString('0xb9ae7a44f9060a80bf436d48c4d7ad42d15715ee')
export const BB_AM_USD_BALANCER_MATIC = Address.fromString('0x787dcb101a0fd5c54a993dcead38e2c6bb98b66e')

// MATIC
export const JBRL_MATIC = '0xf2f77FE7b8e66571E0fca7104c4d670BF1C8d722'.toLowerCase();
export const WETH_MATIC = Address.fromString('0x7ceb23fd6bc0add59e62ac25578270cff1b9f619');
export const BRZ_MATIC = Address.fromString('0x491a4eB4f1FC3BfF8E1d2FC856a6A46663aD556f');
export const ORACLE_PRICE_TETU = Address.fromString('0x0B62ad43837A69Ad60289EEea7C6e907e759F6E8')
export const USDC_MATIC = Address.fromString('0x2791bca1f2de4661ed88a30c99a7a9449aa84174');
export const USDR_MATIC = Address.fromString('0x40379a439d4f6795b6fc9aa5687db461677a2dba');
export const PEARL_MATIC = Address.fromString('0x7238390d5f6f64e67c3211c343a410e2a3dec142');
export const CAVIAR_MATIC = Address.fromString('0x6ae96cc93331c19148541d4d2f31363684917092');
export const PEARL_ROUTER_MATIC = Address.fromString('0xcC25C0FD84737F44a7d38649b69491BBf0c7f083');
export const PAR_USDT_UNISWAP_V_3_MATIC = Address.fromString('0xfa22d298e3b0bc1752e5ef2849cec1149d596674');
export const PAR_MATIC = Address.fromString('0xE2Aa7db6dA1dAE97C5f5C6914d285fBfCC32A128');

// ARB
export const IFARM_ARB = Address.fromString('0x9dca587dc65ac0a043828b0acd946d71eb8d46c1');
export const CAMELOT_ETH_FARM_ARB = Address.fromString('0xd2a7084369cc93672b2ca868757a9f327e3677a4');
export const WETH_ARB = Address.fromString('0x82af49447d8a07e3bd95bd0d56f35241523fbab1');
export const RADIANT_ARB = Address.fromString('0x3082CC23568eA640225c2467653dB90e9250AaA0');
export const X_GRAIL_ARB = Address.fromString('0x3caae25ee616f2c8e13c74da0813402eae3f496b');
export const GRAIL_ARB = Address.fromString('0x3d9907f9a368ad0a51be60f7da3b97cf940982d8');
export const SUSHI_ETH_RADIANT_ARB = Address.fromString('0x3BFB1ac033ff0aE278Be0583FCCc900FBD9382c6');
export const SUSHI_ETH_WSETH_ARB = Address.fromString('0xb0d62768e2Fb9bD437a51B993b77B93Ac9F249d5');
export const USDC_ARB = Address.fromString('0xff970a61a04b1ca14834a43f5de4533ebddb5cc8');
export const SUSHI_SWAP_FACTORY_ARB = Address.fromString('0xc35dadb65012ec5796536bd9864ed8773abc74c4');
export const SILO_ARB = Address.fromString('0x0341c0c0ec423328621788d4854119b97f44e391');
export const WA_WETH_ARB = Address.fromString('0x18C100415988bEF4354EfFAd1188d1c22041B046');
export const ST_ETH_A_ETH_ARB = Address.fromString('0x5a7f39435fd9c381e4932fa2047c9a5136a5e3e7');
export const R_ETH_A_ETH_ARB = Address.fromString('0xcba9ff45cfb9ce238afde32b0148eb82cbe63562');
export const WST_ETH_ARB = Address.fromString('0x5979D7b546E38E414F7E9822514be443A4800529');
export const SOLID_LIZARD_FACTORY_ARB = Address.fromString('0x734d84631f00dC0d3FCD18b04b6cf42BFd407074');
export const CAMELOT_FACTORY_ARB = Address.fromString('0x6eccab422d763ac031210895c81787e87b43a652');
export const WBTC_ARB = Address.fromString('0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f');
export const ARB = Address.fromString('0x912CE59144191C1204E64559FE8253a0e49E6548');
export const UNISWAP_V3_POISON_FINANCE_POOL_ARB = Address.fromString('0xa74eceae9c7670b019e0890881598b4c398d1c01');

// BASE
export const WETH_BASE = Address.fromString('0x4200000000000000000000000000000000000006');
export const USDC_BASE = Address.fromString('0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA');
export const BASE_SWAP_FACTORY_BASE = Address.fromString('0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB');
export const AERODROME_SWAP_FACTORY_BASE = Address.fromString('0x420dd381b31aef6683db6b902084cb0ffece40da');
export const CB_ETH_ETH_POOL_BASE = '0x4c8d67201dced0a8e44f59d419cb74665b4cde55'.toLowerCase();
export const XBSX_BASE = '0xE4750593d1fC8E74b31549212899A72162f315Fa'.toLowerCase();
export const BSX_BASE = Address.fromString('0xd5046b976188eb40f6de40fb527f89c05b323385');


export const WST_ETH_LIST_ARB = [
  WST_ETH_ARB,
  Address.fromString('0x79a2e71460c97807EC40D6d670838bEe99848F1d')
]

export const WETH_LIST_MATIC = [
  Address.fromString('0x4a77ef015ddcd972fd9ba2c7d5d658689d090f1a'),
  Address.fromString('0xd00f9ca46ce0e4a63067c4657986f0167b0de1e5'),
  // weth-btc pool
  Address.fromString('0x209c865390fF2F0E13CE1Eda1Cf74637f364f29f')
]

export const WETH_LIST_BASE = [
  // cbETH
  Address.fromString('0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22'),
  // rETH
  Address.fromString('0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c')
]

export const WETH_LIST_ARB = [
  WETH_ARB,
  ST_ETH_A_ETH_ARB,
  WA_WETH_ARB,
  R_ETH_A_ETH_ARB,
  Address.fromString('0x36bf227d6bac96e2ab1ebb5492ecec69c691943f'.toLowerCase()),
  Address.fromString('0xe62880CC6872c9E9Fb1DDd73f400850fdaBE798D'.toLowerCase()),
  Address.fromString('0x5477B2E46DD6D2D8E52f8329f0DC283F6f768cFa'),
  Address.fromString('0x4186BFC76E2E237523CBC30FD220FE055156b41F'),
  Address.fromString('0x6F02C88650837C8dfe89F66723c4743E9cF833cd')
];

export const MATIC_NETWORK: string = 'matic';
export const ARBITRUM_NETWORK: string = 'arbitrum-one';
export const BASE_NETWORK: string = 'base';
export const ZK_SYNC_ERA_NETWORK: string = 'zksync-era';

export const CALCULATE_ONLY_TVL_MATIC = [
  '0x41f36bb5b26f2e8646e6adc97faa5e2844a6c842',
  '0x948ad16cd52a1658b404fe67ed7a56360f52ce08',
  '0x9ef89a962b421b26def4b5f6435c6fe698fda822',
  '0xdde43710defef6cbcf820b18debfc3cf9a4f449f',
  '0xa5422f737f24b10a0928d5e7f6cf404d077e1cd1',
  '0x506337cc631726a21788b9fdfb6be6292ba7a835',
  '0x72d35bd4123f5c60d4cb84bfcb40946259223860',
  '0xA9B35ef7C2289b5D0391381bF8a2560d2eb0F961'.toLowerCase(),
  '0x2De733b3313890223a5D822488f6DD96cA4701C3'.toLowerCase(),
  '0x548E84517b2891E0316f604f4f5326a306F1830e'.toLowerCase(),
  '0x2eD9699441CE48F2AA9C03Af66510D6d72750591'.toLowerCase()
]

export const STABLE_COIN_ARRAY_MAINNET = [
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'.toLowerCase(),
  '0xe9e7cea3dedca5984780bafc599bd69add087d56'.toLowerCase(),
  '0xdAC17F958D2ee523a2206206994597C13D831ec7'.toLowerCase(),
  '0x0000000000085d4780B73119b644AE5ecd22b376'.toLowerCase(),
  '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase(),

  // Orbit Bridge Polygon Tether USD (oUSDT)
  '0x957da9ebbcdc97dc4a8c274dd762ec2ab665e15f'.toLowerCase()
]

export const STABLE_COIN_ARRAY_MATIC = [
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'.toLowerCase(),
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'.toLowerCase(),
  '0xE840B73E5287865EEc17d250bFb1536704B43B21'.toLowerCase(),
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'.toLowerCase(),
  // Orbit Bridge Polygon Tether USD (oUSDT)
  '0x957da9ebbcdc97dc4a8c274dd762ec2ab665e15f'.toLowerCase(),
  // Orbit Bridge Polygon USD Coin (oUSDC)
  '0x5bef2617ecca9a39924c09017c5f1e25efbb3ba8'.toLowerCase(),
  '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'.toLowerCase(),
  // STAR
  '0xc19669a405067927865b40ea045a2baabbbe57f5'.toLowerCase(),
  '0xE2Aa7db6dA1dAE97C5f5C6914d285fBfCC32A128'.toLowerCase()
]

export const STABLE_COIN_ARRAY_ARBITRUM = [
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'.toLowerCase(),
  '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'.toLowerCase(),
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'.toLowerCase(),
  // STASIS EURS Token (EURS)
  '0xD22a58f79e9481D1a88e00c343885A588b34b68B'.toLowerCase(),
  // USD Coin (Arb1)-LP (S*USDC)
  '0x892785f33cdee22a30aef750f285e18c18040c3e'.toLowerCase(),
  // USD+
  '0xe80772eaf6e2e18b651f160bc9158b2a5cafca65'.toLowerCase(),
  // agEUR
  '0xfa5ed56a203466cbbc2430a43c66b9d8723528e7'.toLowerCase(),
  '0x93b346b6bc2548da6a1e7d98e9a421b42541425b'.toLowerCase(),
  // wjAura
  '0xcB9295ac65De60373A25C18d2044D517ed5da8A9'.toLowerCase(),
  '0xbF353C369Aa753b211374D7ecB286da499991C94'.toLowerCase(),
  '0x0Fa7b744F18D8E8c3D61B64b110F25CC27E73055'.toLowerCase(),
  '0x2977b0B54a76c2b56D32cef19f8ea83Cc766cFD9'.toLowerCase(),
  '0xE5232c2837204ee66952f365f104C09140FB2E43'.toLowerCase(),
  '0x5Ef78a0966BD47dEd63034678083714b4DE6e013'.toLowerCase(),
  '0x85cebd962861be410a777755dfa06914de6af003'.toLowerCase(),

  '0x48ad8eE28af1057Cdec42080D3Fd57b3E877d59C'.toLowerCase(),
  '0xc49bebC972f5390eE1EC8A69E4151838f59334Fc'.toLowerCase(),
  '0x5Ef78a0966BD47dEd63034678083714b4DE6e013'.toLowerCase(),
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'.toLowerCase(),

  // underlying
  '0x399f292939668e591957726df3ec9a0e7dc8ac57'.toLowerCase(),
  '0x8409de8e98f80d0e40f42849ef0923c2493beead'.toLowerCase(),
  '0xd86b1c1c7f921f3663921f8917d086379739cda3'.toLowerCase(),
]

export const STABLE_COIN_ARRAY_BASE = [
  '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA'.toLowerCase(),
  '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'.toLowerCase(),
  '0xEB466342C4d449BC9f53A865D5Cb90586f405215'.toLowerCase(),
  // crvUSD
  '0x417Ac0e078398C154EdFadD9Ef675d30Be60Af93'.toLowerCase(),
  // USDC, USDBc, axlUSDC, crvUSD stable pool
  '0x492A07E2f2BD6a85597052f6497aC830DA0a5f63'.toLowerCase(),
  '0x9483ab65847a447e36d21af1cab8c87e9712ff93'.toLowerCase(),
  // DOLA
  '0x4621b7a9c75199271f773ebd9a499dbd165c3191'.toLowerCase(),
  '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376'.toLowerCase(),
  '0xC19669A405067927865B40Ea045a2baabbbe57f5'.toLowerCase()
]

export const STABLE_COIN_POOL_ARRAY_ARB = [
  '0x3aDf984c937FA6846E5a24E0A68521Bdaf767cE1'.toLowerCase(),
  '0x2FE7AE43591E534C256A1594D326e5779E302Ff4'.toLowerCase(),
  '0x73aF1150F265419Ef8a5DB41908B700C32D49135'.toLowerCase(),
  '0xec090cf6DD891D2d014beA6edAda6e05E025D93d'.toLowerCase(),
  '0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5'.toLowerCase(),
  '0x7f90122BF0700F9E7e1F688fe926940E8839F353'.toLowerCase(),
  '0x2bb55dC7c125D132322d6f7056FF6a575D64Fb7C'.toLowerCase(),
]

export const BTC_POOLS_ARB = [
  '0x542f16da0efb162d20bf4358efa095b70a100f9e'.toLowerCase(),
  '0x6c1B07ed05656DEdd90321E94B1cDB26981e65f2'.toLowerCase()
]

export const ARB_POOL = [
  '0xf6da879761961ABD22177242904a6E12BB034C22'.toLowerCase(),
  '0xf6da879761961ABD22177242904a6E12BB034C22'.toLowerCase()
];

export const CONVEX_POOL_LIST_ARB = [
  '0x3c64d44Ab19D63F09ebaD38fd7b913Ab7E15e341'.toLowerCase(),
  '0x82670f35306253222F8a165869B28c64739ac62e'.toLowerCase(),
  '0xF7Fed8Ae0c5B78c19Aadd68b700696933B0Cefd9'.toLowerCase()
]

export const BALANCER_CONTRACT_NAME = [
  'Balancer'.toLowerCase(),
  'frxETH-WETH'.toLowerCase(),
  '20WMATIC-80SPHERE'.toLowerCase(),
  '20WETH-80BAL'.toLowerCase(),
  '20USDC-80TNGBL'.toLowerCase(),
  '2eur (PAR)'.toLowerCase(),
  '50wstETH-BPT-50bbaUSD'.toLowerCase(),
  'RDNT-WETH'.toLowerCase(),
  '50tBTC-50WETH'.toLowerCase(),
  '80PAL-20OHM'.toLowerCase(),
  'AuraBal'.toLowerCase(),
  '50WETH-50GOLD'.toLowerCase()
]

export const LP_UNI_PAIR_CONTRACT_NAME = [
  '1inch'.toLowerCase(),
  'SushiSwap'.toLowerCase(),
  // only uniswap v2
  'Uniswap'.toLowerCase(),
  'Pancake'.toLowerCase(),
  'Kyber'.toLowerCase(),
  'ApeSwapFinance'.toLowerCase(),
  'Volatile AMM'.toLowerCase(),
  'Stable AMM'.toLowerCase(),
  'BaseSwap'.toLowerCase()
]

export const PEARL_CONTRACT_NAME = [
  'VolatileV1'.toLowerCase(),
  'StableV1'.toLowerCase(),
]

export const CURVE_CONTRACT_NAME = [
  'Curve.fi'.toLowerCase(),
  'tricrypto'.toLowerCase()
]

export const F_UNI_V3_CONTRACT_NAME = 'fUniV3'.toLowerCase()
export const MESH_SWAP_CONTRACT = 'Meshswap'.toLowerCase()
export const TETU_CONTRACT = 'Tetu'.toLowerCase()
export const QUICK_SWAP_CONTRACT = 'a'.toLowerCase()
export const POISON_FINANCE_CONTRACT = 'Poison.Finance Poison Ivy'.toLowerCase();
export const CAMELOT_CONTRACT = 'Camelot'.toLowerCase();
export const MAGPIE_CONTRACT = 'Wombat'.toLowerCase();


export function getOrCreateStorageAddress(): string | null {
  const network = dataSource.network();
  if (network == MATIC_NETWORK) {
    return STORAGE_MATIC;
  } else if (network == ARBITRUM_NETWORK) {
    return STORAGE_ARBITRUM;
  } else if (network == BASE_NETWORK) {
    return STORAGE_BASE;
  } else if (network == ZK_SYNC_ERA_NETWORK) {
    return STORAGE_ZK_SYNC_ERA;
  }
  log.log(log.Level.ERROR, `Can not get storage address, network: ${network}`)
  return null;
}

export function isStableCoin(address: string): boolean {
  if (dataSource.network() == 'mainnet') {
    return STABLE_COIN_ARRAY_MAINNET.join(' ').includes(address) == true
  } else if (dataSource.network() == MATIC_NETWORK) {
    return STABLE_COIN_ARRAY_MATIC.join(' ').includes(address) == true
  } else if (dataSource.network() == ARBITRUM_NETWORK) {
    return STABLE_COIN_ARRAY_ARBITRUM.join(' ').includes(address) == true
  } else if (dataSource.network() == BASE_NETWORK) {
    return STABLE_COIN_ARRAY_BASE.join(' ').includes(address) == true;

  }
  return false
}

export function blockDelay(): number {
  const network = dataSource.network();
  if (network == MATIC_NETWORK) {
    return 41600;
  } else if (network == ARBITRUM_NETWORK) {
    return 315360;
  } else if (network == BASE_NETWORK) {
    return 43440;
  } else if (network == ZK_SYNC_ERA_NETWORK) {
    return 252000;
  }
  return 0;
}

export function isAmUsd(address: Address): boolean {
  return address == AM_USD_BALANCER_MATIC || address == BB_AM_USD_BALANCER_MATIC;
}

export function isLpUniPair(name: string): boolean {
  for (let i=0;i<LP_UNI_PAIR_CONTRACT_NAME.length;i++) {
    if (name.toLowerCase().startsWith(LP_UNI_PAIR_CONTRACT_NAME[i])) {
      return true
    }
  }
  return false
}

export function isBalancer(name: string): boolean {
  for (let i=0;i<BALANCER_CONTRACT_NAME.length;i++) {
    if (name.toLowerCase().startsWith(BALANCER_CONTRACT_NAME[i])) {
      return true
    }
  }
  return false
}

export function isCurve(name: string): boolean {
  for (let i=0;i<CURVE_CONTRACT_NAME.length;i++) {
    if (name.toLowerCase().startsWith(CURVE_CONTRACT_NAME[i])) {
      return true
    }
  }
  return false
}

export function isUniswapV3(name: string): boolean {
  if (name.toLowerCase().startsWith(F_UNI_V3_CONTRACT_NAME)) {
    return true
  }
  return false
}

export function isMeshSwap(name: string): boolean {
  if (name.toLowerCase().startsWith(MESH_SWAP_CONTRACT)) {
    return true
  }
  return false
}

export function isTetu(name: string): boolean {
  if (name.toLowerCase().startsWith(TETU_CONTRACT)) {
    return true;
  }
  return false;
}

export function isQuickSwapUniV3(name: string, address: Address): boolean {
  if (!name.toLowerCase().startsWith(QUICK_SWAP_CONTRACT)) {
    return false;
  }
  const contract = QuickSwapVaultContract.bind(address)
  return !contract.try_pool().reverted
}

export function isPearl(name: string): boolean {
  for (let i=0;i<PEARL_CONTRACT_NAME.length;i++) {
    if (name.toLowerCase().startsWith(PEARL_CONTRACT_NAME[i])) {
      return true
    }
  }
  return false
}

export function isPar(address: Address): boolean {
  return address === PAR_MATIC;
}


export function isBrl(address: string): boolean {
  return address == JBRL_MATIC;
}

export function isWeth(address: Address): boolean {
  let list: Address[] = [];
  if (dataSource.network() == MATIC_NETWORK) {
    list = WETH_LIST_MATIC;
  } else if (dataSource.network() == ARBITRUM_NETWORK) {
    list = WETH_LIST_ARB;
  } else if (dataSource.network() == BASE_NETWORK) {
    list = WETH_LIST_BASE;
  }
  for (let i=0;i<list.length;i++) {
    if (address.equals(list[i])) {
      return true
    }
  }
  return false
}

export function isWsteth(address: Address): boolean {
  for (let i = 0; i < WST_ETH_LIST_ARB.length; i++) {
    if (address.equals(WST_ETH_LIST_ARB[i])) {
      return true;
    }
  }
  return false;
}

export function isStablePool(address: string): boolean {
  for (let i = 0; i < STABLE_COIN_POOL_ARRAY_ARB.length; i++) {
    if (address.toLowerCase() == STABLE_COIN_POOL_ARRAY_ARB[i]) {
      return true;
    }
  }
  return false;
}

export function isGammaVault(name: string, address: string): boolean {
  return !!(name.toLowerCase().startsWith('a') &&
    !GammaVaultContract.bind(Address.fromString(address)).try_getBasePosition().reverted);
}

export function isBtc(address: string): boolean {
  for (let i = 0; i < BTC_POOLS_ARB.length; i++) {
    if (address.toLowerCase() == BTC_POOLS_ARB[i]) {
      return true;
    }
  }

  return false;
}

export function isArb(address: string): boolean {
  for (let i = 0; i < ARB_POOL.length; i++) {
    if (address.toLowerCase() == ARB_POOL[i]) {
      return true;
    }
  }
  return false;
}

export function isConvex(address: string): boolean {
  for (let i = 0; i < CONVEX_POOL_LIST_ARB.length; i++) {
    if (address.toLowerCase() == CONVEX_POOL_LIST_ARB[i]) {
      return true;
    }
  }
  return false;
}

export function isPoisonFinanceToken(name: string): boolean {
  return name.toLowerCase() == POISON_FINANCE_CONTRACT;
}

export function isCamelot(name: string): boolean {
  return !!name.toLowerCase().startsWith(CAMELOT_CONTRACT);
}

export function isCamelotUniswapV3(name: string, address: string): boolean {
  if (!name.toLowerCase().startsWith('a')) {
    return false;
  }
  return !CamelotUniswapV3Vault.bind(Address.fromString(address)).try_getTotalAmounts().reverted;
}


export function isMagpie(name: string): boolean {
  return !!name.startsWith(MAGPIE_CONTRACT);
}

export function checkBalancer(address: Address): boolean {
  const contract = WeightedPool2TokensContract.bind(address);
  return !contract.try_getPoolId().reverted;
}
