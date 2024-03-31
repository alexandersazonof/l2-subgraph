import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Controller } from '../../generated/schema';
import { ControllerListener } from '../../generated/templates';

export function getOrCreateController(id: string, timestamp: BigInt = BigInt.zero()): Controller {
  let controller = Controller.load(id);
  if (controller == null) {
    controller = new Controller(id);
    controller.timestamp = timestamp;
    controller.save();
    ControllerListener.create(Address.fromString(id));
  }
  return controller as Controller;
}