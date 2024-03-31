import { Transfer } from '../generated/templates/VaultListener/ERC20';
import { getOrCreatePool, isPool } from './helpers/pool-helper';
import { createTvl } from './helpers/tvl-helper';
import { getOrCreateVault } from './helpers/vault-helper';
import { createUserBalance } from './helpers/users-helper';

export function handleTransfer(event: Transfer): void {
  const to = event.params.to;
  const vault = getOrCreateVault(event.address.toHexString(), event.block.timestamp);

  if (isPool(to)) {
    const pool = getOrCreatePool(to, event.block.timestamp);
    vault.pool = pool.id;
  }
  const tvl = createTvl(vault, event.block.timestamp);
  vault.tvl = tvl.value;
  vault.save();
  createUserBalance(vault, event.params.from, false, event.block.timestamp);
  createUserBalance(vault, event.params.to, true, event.block.timestamp);
}