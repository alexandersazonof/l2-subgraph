import { BigInt } from "@graphprotocol/graph-ts"
import {
  ControllerContract,
  AddedAddressToWhitelist,
  AddedCodeToWhitelist,
  ConfirmNextImplementationDelay,
  ConfirmPlatformFeeChange,
  ConfirmProfitSharingChange,
  ConfirmStrategistFeeChange,
  QueueNextImplementationDelay,
  QueuePlatformFeeChange,
  QueueProfitSharingChange,
  QueueStrategistFeeChange,
  RemovedAddressFromWhitelist,
  RemovedCodeFromWhitelist,
  SharePriceChangeLog
} from "../generated/ControllerContract/ControllerContract"
import { ExampleEntity } from "../generated/schema"

export function handleAddedAddressToWhitelist(
  event: AddedAddressToWhitelist
): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from)

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity._address = event.params._address

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.FEE_DENOMINATOR(...)
  // - contract.MAX_TOTAL_FEE(...)
  // - contract.addressWhitelist(...)
  // - contract.codeWhitelist(...)
  // - contract.feeDenominator(...)
  // - contract.getContractHash(...)
  // - contract.getPricePerFullShare(...)
  // - contract.governance(...)
  // - contract.greyList(...)
  // - contract.hardWorkers(...)
  // - contract.nextImplementationDelay(...)
  // - contract.nextPlatformFeeNumerator(...)
  // - contract.nextPlatformFeeNumeratorTimestamp(...)
  // - contract.nextProfitSharingNumerator(...)
  // - contract.nextProfitSharingNumeratorTimestamp(...)
  // - contract.nextStrategistFeeNumerator(...)
  // - contract.nextStrategistFeeNumeratorTimestamp(...)
  // - contract.platformFeeNumerator(...)
  // - contract.profitSharingNumerator(...)
  // - contract.profitSharingReceiver(...)
  // - contract.protocolFeeReceiver(...)
  // - contract.rewardForwarder(...)
  // - contract.store(...)
  // - contract.strategistFeeNumerator(...)
  // - contract.targetToken(...)
  // - contract.tempNextImplementationDelay(...)
  // - contract.tempNextImplementationDelayTimestamp(...)
  // - contract.universalLiquidator(...)
}

export function handleAddedCodeToWhitelist(event: AddedCodeToWhitelist): void {}

export function handleConfirmNextImplementationDelay(
  event: ConfirmNextImplementationDelay
): void {}

export function handleConfirmPlatformFeeChange(
  event: ConfirmPlatformFeeChange
): void {}

export function handleConfirmProfitSharingChange(
  event: ConfirmProfitSharingChange
): void {}

export function handleConfirmStrategistFeeChange(
  event: ConfirmStrategistFeeChange
): void {}

export function handleQueueNextImplementationDelay(
  event: QueueNextImplementationDelay
): void {}

export function handleQueuePlatformFeeChange(
  event: QueuePlatformFeeChange
): void {}

export function handleQueueProfitSharingChange(
  event: QueueProfitSharingChange
): void {}

export function handleQueueStrategistFeeChange(
  event: QueueStrategistFeeChange
): void {}

export function handleRemovedAddressFromWhitelist(
  event: RemovedAddressFromWhitelist
): void {}

export function handleRemovedCodeFromWhitelist(
  event: RemovedCodeFromWhitelist
): void {}

export function handleSharePriceChangeLog(event: SharePriceChangeLog): void {}
