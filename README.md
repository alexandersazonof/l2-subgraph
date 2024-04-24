# Subgraph L2
___

## Entity description
```
type Storage @entity {
  id: ID!
  controllers: [Controller!]! @derivedFrom(field: "storage")
  timestamp: BigInt!
}

type Controller @entity {
  id: ID!
  storage: Storage
  timestamp: BigInt!
}
# last info about vaults
type Vault @entity {
  id: ID!
  name: String!
  symbol: String!
  pool: Pool
  decimal: Int!
  underlying: Token!
  # last TVL
  tvl: BigDecimal!
  # last price
  priceUnderlying: BigDecimal!
  # last apy reward + apy compund
  apy: BigDecimal!
  # last apy reward
  apyReward: BigDecimal!
  # last apy compound
  apyAutoCompound: BigDecimal!
  lastShareTimestamp: BigInt!
  lastSharePrice: BigInt!
  skipFirstApyReward: Boolean
  users: [String!]!
  lastUsersShareTimestamp: BigInt!
  # create time
  timestamp: BigInt!
}

# create on every SharePriceChangeLog event
type SharePrice @entity {
  "tx hash"
  id: ID!
  vault: Vault
  oldSharePrice: BigInt!
  newSharePrice: BigInt!
  timestamp: BigInt!
}

enum PoolType {
  NoMintRewardPool
  PotPool
  ExclusiveRewardPool
}

type Token @entity {
  "token address"
  id: ID!
  name: String!
  symbol: String!
  decimals: Int!
}

type Pool @entity {
  id: ID!
  vault: Vault!
  type: PoolType!
  timestamp: BigInt!
}

# create on every SharePriceChangeLog event
type VaultHistory @entity {
  "tx + vault address"
  id: ID!
  vault: Vault!

  priceUnderlying: BigDecimal!
  sharePrice: BigInt!
  sharePriceDec: BigDecimal!
  timestamp: BigInt!
}

type VaultUtil @entity {
  id: ID!
  vaults: [Vault!]!
  vaultLength: Int!
  lastBlockUpdate: Int!
}

# create every ~15-24 hours
type PriceFeed @entity {
  id: ID!
  vault: Vault!
  price: BigDecimal!
  sharePrice: BigDecimal!
  # price * sharePrice
  value: BigDecimal!
  timestamp: BigInt!
  createAtBlock: BigInt!
}

# TVL history
type Tvl @entity {
  id: ID!
  vault: Vault!
  totalSupply: BigInt!
  value: BigDecimal!
  priceUnderlying: BigDecimal!
  sharePrice: BigInt!
  timestamp: BigInt!
  sharePriceDivDecimal: BigDecimal!
  decimal: BigDecimal!
}

# current user balance
type UserBalance @entity {
  id: ID!
  vault: Vault!
  userAddress: String!
  value: BigDecimal!
  poolBalance: BigDecimal!
  vaultBalance: BigDecimal!
  timestamp: BigInt!
}

# user balance history
type UserBalanceHistory @entity {
  "tx-user"
  id: ID!
  userAddress: String!
  transactionType: TransactionType!
  vault: Vault!
  "Amount balance in user address"
  value: BigDecimal!
  vaultBalance: BigDecimal!
  poolBalance: BigDecimal!
  priceUnderlying: BigDecimal!
  sharePrice: BigInt!
  timestamp: BigInt!
}

enum TransactionType {
  Deposit
  Withdraw
}

type Reward @entity {
  id: ID!
  timestamp: BigInt!
  pool: Pool!
  "token that is rewarded"
  token: Token!
  "amount of reward added"
  reward: BigInt!
  "reward rate after reward was added - valid untill next reward or periodFinish"
  rewardRate: BigInt!
  "timestamp when the pool runs out of rewards if no new rewards are added"
  periodFinish: BigInt!
}

# apy reward history
type ApyReward @entity {
  id: ID!
  vault: Vault!
  apy: BigDecimal!
  apr: BigDecimal!
  prices: [BigDecimal!]!
  periodFinishes: [BigInt!]!
  rewardRates: [BigInt!]!
  rewardForPeriods: [BigDecimal!]!
  tvlUsd: BigDecimal!
  timestamp: BigInt!
}

# apy auto compound history
type ApyAutoCompound @entity {
  id: ID!
  vault: Vault!
  apy: BigDecimal!
  apr: BigDecimal!
  diffSharePrice: BigDecimal!
  diffTimestamp: BigDecimal!
  timestamp: BigInt!
}

# apy general history
type GeneralApy @entity {
  id: ID!
  apy: BigDecimal!
  apyAutoCompound: BigDecimal!
  apyReward: BigDecimal!
  vault: Vault!
  timestamp: BigInt!
}

type TotalTvlUtil @entity{
  # id is 1
  id: ID!

  vaults: [String!]!
  lastTimestampUpdate: BigInt!

  timestamp: BigInt!
}

type TotalTvlCount @entity{
  # id is 1
  id: ID!

  length: BigInt!
}

type TotalTvlHistoryV2 @entity{
  id: ID!

  value: BigDecimal!
  sequenceId: BigInt!

  timestamp: BigInt!
}
```