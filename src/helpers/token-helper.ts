import { Address } from '@graphprotocol/graph-ts';
import { Token } from '../../generated/schema';
import { ERC20 } from '../../generated/templates/ControllerListener/ERC20';
import { DEFAULT_DECIMAL, UNKNOWN } from '../utils/constant';

export function loadOrCreateToken(tokenAddress: Address): Token{
  let token = Token.load(tokenAddress.toHex())
  if (token == null) {
    let tokenContract = ERC20.bind(tokenAddress)
    token = new Token(tokenAddress.toHex())
    token.name = tokenContract.try_name().reverted ? UNKNOWN : tokenContract.name();
    token.symbol = tokenContract.try_symbol().reverted ? UNKNOWN : tokenContract.symbol()
    token.decimals = tokenContract.try_decimals().reverted ? DEFAULT_DECIMAL :tokenContract.decimals()
    token.save()
  }
  return token as Token
}