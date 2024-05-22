import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Storage } from '../generated/schema';
import { blockDelay, getOrCreateStorageAddress } from './utils/constant';
import { getOrCreateController } from './helpers/controller-helper';
import { StorageContract } from '../generated/StorageListener/StorageContract';
import { getOrCreateVault, getVaultUtils } from './helpers/vault-helper';
import { createPriceFeed } from './helpers/price-feed-helper';
import { getPriceByVault } from './utils/price-utils';
import { SetControllerCall } from '../generated/StorageContract/StorageContract';

export function handleBlock(block: ethereum.Block): void {
  const storageAdr = getOrCreateStorageAddress();
  if (storageAdr) {
    let storage = Storage.load(storageAdr);
    if (!storage) {
      storage = new Storage(storageAdr);
      storage.timestamp = block.timestamp;
      storage.save();
    }
    const tryController = StorageContract.bind(Address.fromString(storageAdr)).try_controller();
    if (!tryController.reverted) {
      const controller = getOrCreateController(tryController.value.toHexString(), block.timestamp);
      controller.storage = storage.id;
      controller.save();
    }
  }
  handleBlockPriceHistory(block);
}

export function handleSetController(call: SetControllerCall): void {
  const controller = getOrCreateController(call.inputs._controller.toHexString(), call.block.timestamp);
}

export function handleBlockPriceHistory(block: ethereum.Block): void {
  const vaultUtils = getVaultUtils();
  if (block.number.toI32() < vaultUtils.lastBlockUpdate + blockDelay()) {
    return;
  }
  for (let i = 0; i < vaultUtils.vaults.length; i++) {
    const vault = getOrCreateVault(vaultUtils.vaults[i]);
    const price = getPriceByVault(vault);
    vault.priceUnderlying = price
    vault.save();

    createPriceFeed(vault, block);
  }
  vaultUtils.lastBlockUpdate = block.number.toI32();
  vaultUtils.save();
}