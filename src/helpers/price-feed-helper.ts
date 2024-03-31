import { PriceFeed, Vault } from '../../generated/schema';
import { BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { pow } from '../utils/number-utils';
import { BD_TEN } from '../utils/constant';

export function createPriceFeed(vault: Vault, block: ethereum.Block): PriceFeed {
  const id = `${vault.id}-${block.number.toString()}`;
  let priceFeed = PriceFeed.load(id);
  if (!priceFeed) {
    priceFeed = new PriceFeed(id);
    priceFeed.vault = vault.id
    priceFeed.price = vault.priceUnderlying;
    priceFeed.sharePrice = BigDecimal.fromString('1');
    priceFeed.value = BigDecimal.zero();
    priceFeed.createAtBlock = block.number
    priceFeed.timestamp = block.timestamp

    if (vault.lastSharePrice.gt(BigInt.zero())) {
      const sharePrice = vault.lastSharePrice.divDecimal(pow(BD_TEN, vault.decimal))
      priceFeed.sharePrice = sharePrice;
      priceFeed.value = vault.priceUnderlying.times(sharePrice);
    }
    priceFeed.save();
  }

  return priceFeed;
}