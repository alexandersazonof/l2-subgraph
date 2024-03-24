import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
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

export function createAddedAddressToWhitelistEvent(
  _address: Address
): AddedAddressToWhitelist {
  let addedAddressToWhitelistEvent = changetype<AddedAddressToWhitelist>(
    newMockEvent()
  )

  addedAddressToWhitelistEvent.parameters = new Array()

  addedAddressToWhitelistEvent.parameters.push(
    new ethereum.EventParam("_address", ethereum.Value.fromAddress(_address))
  )

  return addedAddressToWhitelistEvent
}

export function createAddedCodeToWhitelistEvent(
  _address: Address
): AddedCodeToWhitelist {
  let addedCodeToWhitelistEvent = changetype<AddedCodeToWhitelist>(
    newMockEvent()
  )

  addedCodeToWhitelistEvent.parameters = new Array()

  addedCodeToWhitelistEvent.parameters.push(
    new ethereum.EventParam("_address", ethereum.Value.fromAddress(_address))
  )

  return addedCodeToWhitelistEvent
}

export function createConfirmNextImplementationDelayEvent(
  implementationDelay: BigInt
): ConfirmNextImplementationDelay {
  let confirmNextImplementationDelayEvent = changetype<
    ConfirmNextImplementationDelay
  >(newMockEvent())

  confirmNextImplementationDelayEvent.parameters = new Array()

  confirmNextImplementationDelayEvent.parameters.push(
    new ethereum.EventParam(
      "implementationDelay",
      ethereum.Value.fromUnsignedBigInt(implementationDelay)
    )
  )

  return confirmNextImplementationDelayEvent
}

export function createConfirmPlatformFeeChangeEvent(
  platformFeeNumerator: BigInt
): ConfirmPlatformFeeChange {
  let confirmPlatformFeeChangeEvent = changetype<ConfirmPlatformFeeChange>(
    newMockEvent()
  )

  confirmPlatformFeeChangeEvent.parameters = new Array()

  confirmPlatformFeeChangeEvent.parameters.push(
    new ethereum.EventParam(
      "platformFeeNumerator",
      ethereum.Value.fromUnsignedBigInt(platformFeeNumerator)
    )
  )

  return confirmPlatformFeeChangeEvent
}

export function createConfirmProfitSharingChangeEvent(
  profitSharingNumerator: BigInt
): ConfirmProfitSharingChange {
  let confirmProfitSharingChangeEvent = changetype<ConfirmProfitSharingChange>(
    newMockEvent()
  )

  confirmProfitSharingChangeEvent.parameters = new Array()

  confirmProfitSharingChangeEvent.parameters.push(
    new ethereum.EventParam(
      "profitSharingNumerator",
      ethereum.Value.fromUnsignedBigInt(profitSharingNumerator)
    )
  )

  return confirmProfitSharingChangeEvent
}

export function createConfirmStrategistFeeChangeEvent(
  strategistFeeNumerator: BigInt
): ConfirmStrategistFeeChange {
  let confirmStrategistFeeChangeEvent = changetype<ConfirmStrategistFeeChange>(
    newMockEvent()
  )

  confirmStrategistFeeChangeEvent.parameters = new Array()

  confirmStrategistFeeChangeEvent.parameters.push(
    new ethereum.EventParam(
      "strategistFeeNumerator",
      ethereum.Value.fromUnsignedBigInt(strategistFeeNumerator)
    )
  )

  return confirmStrategistFeeChangeEvent
}

export function createQueueNextImplementationDelayEvent(
  implementationDelay: BigInt,
  validAtTimestamp: BigInt
): QueueNextImplementationDelay {
  let queueNextImplementationDelayEvent = changetype<
    QueueNextImplementationDelay
  >(newMockEvent())

  queueNextImplementationDelayEvent.parameters = new Array()

  queueNextImplementationDelayEvent.parameters.push(
    new ethereum.EventParam(
      "implementationDelay",
      ethereum.Value.fromUnsignedBigInt(implementationDelay)
    )
  )
  queueNextImplementationDelayEvent.parameters.push(
    new ethereum.EventParam(
      "validAtTimestamp",
      ethereum.Value.fromUnsignedBigInt(validAtTimestamp)
    )
  )

  return queueNextImplementationDelayEvent
}

export function createQueuePlatformFeeChangeEvent(
  platformFeeNumerator: BigInt,
  validAtTimestamp: BigInt
): QueuePlatformFeeChange {
  let queuePlatformFeeChangeEvent = changetype<QueuePlatformFeeChange>(
    newMockEvent()
  )

  queuePlatformFeeChangeEvent.parameters = new Array()

  queuePlatformFeeChangeEvent.parameters.push(
    new ethereum.EventParam(
      "platformFeeNumerator",
      ethereum.Value.fromUnsignedBigInt(platformFeeNumerator)
    )
  )
  queuePlatformFeeChangeEvent.parameters.push(
    new ethereum.EventParam(
      "validAtTimestamp",
      ethereum.Value.fromUnsignedBigInt(validAtTimestamp)
    )
  )

  return queuePlatformFeeChangeEvent
}

export function createQueueProfitSharingChangeEvent(
  profitSharingNumerator: BigInt,
  validAtTimestamp: BigInt
): QueueProfitSharingChange {
  let queueProfitSharingChangeEvent = changetype<QueueProfitSharingChange>(
    newMockEvent()
  )

  queueProfitSharingChangeEvent.parameters = new Array()

  queueProfitSharingChangeEvent.parameters.push(
    new ethereum.EventParam(
      "profitSharingNumerator",
      ethereum.Value.fromUnsignedBigInt(profitSharingNumerator)
    )
  )
  queueProfitSharingChangeEvent.parameters.push(
    new ethereum.EventParam(
      "validAtTimestamp",
      ethereum.Value.fromUnsignedBigInt(validAtTimestamp)
    )
  )

  return queueProfitSharingChangeEvent
}

export function createQueueStrategistFeeChangeEvent(
  strategistFeeNumerator: BigInt,
  validAtTimestamp: BigInt
): QueueStrategistFeeChange {
  let queueStrategistFeeChangeEvent = changetype<QueueStrategistFeeChange>(
    newMockEvent()
  )

  queueStrategistFeeChangeEvent.parameters = new Array()

  queueStrategistFeeChangeEvent.parameters.push(
    new ethereum.EventParam(
      "strategistFeeNumerator",
      ethereum.Value.fromUnsignedBigInt(strategistFeeNumerator)
    )
  )
  queueStrategistFeeChangeEvent.parameters.push(
    new ethereum.EventParam(
      "validAtTimestamp",
      ethereum.Value.fromUnsignedBigInt(validAtTimestamp)
    )
  )

  return queueStrategistFeeChangeEvent
}

export function createRemovedAddressFromWhitelistEvent(
  _address: Address
): RemovedAddressFromWhitelist {
  let removedAddressFromWhitelistEvent = changetype<
    RemovedAddressFromWhitelist
  >(newMockEvent())

  removedAddressFromWhitelistEvent.parameters = new Array()

  removedAddressFromWhitelistEvent.parameters.push(
    new ethereum.EventParam("_address", ethereum.Value.fromAddress(_address))
  )

  return removedAddressFromWhitelistEvent
}

export function createRemovedCodeFromWhitelistEvent(
  _address: Address
): RemovedCodeFromWhitelist {
  let removedCodeFromWhitelistEvent = changetype<RemovedCodeFromWhitelist>(
    newMockEvent()
  )

  removedCodeFromWhitelistEvent.parameters = new Array()

  removedCodeFromWhitelistEvent.parameters.push(
    new ethereum.EventParam("_address", ethereum.Value.fromAddress(_address))
  )

  return removedCodeFromWhitelistEvent
}

export function createSharePriceChangeLogEvent(
  vault: Address,
  strategy: Address,
  oldSharePrice: BigInt,
  newSharePrice: BigInt,
  timestamp: BigInt
): SharePriceChangeLog {
  let sharePriceChangeLogEvent = changetype<SharePriceChangeLog>(newMockEvent())

  sharePriceChangeLogEvent.parameters = new Array()

  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )
  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam(
      "oldSharePrice",
      ethereum.Value.fromUnsignedBigInt(oldSharePrice)
    )
  )
  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam(
      "newSharePrice",
      ethereum.Value.fromUnsignedBigInt(newSharePrice)
    )
  )
  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return sharePriceChangeLogEvent
}
