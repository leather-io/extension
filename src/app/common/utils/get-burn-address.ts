import type { StacksNetwork } from '@stacks/network';
import { ChainID } from '@stacks/transactions';

export function getBurnAddress(network: StacksNetwork): string {
  switch (network.chainId) {
    case ChainID.Mainnet:
      return 'SP00000000000003SCNSJTCSE62ZF4MSE';
    case ChainID.Testnet:
      return 'ST000000000000000000002AMW42H';
    default:
      return 'ST000000000000000000002AMW42H';
  }
}
