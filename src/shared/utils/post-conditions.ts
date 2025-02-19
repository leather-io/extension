import type { PostCondition } from '@stacks/transactions';
import BN from 'bn.js';

import { formatAssetString } from '@leather.io/stacks';

interface FtPostConditionsOptions {
  amount: string | number;
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
  stxAddress: string;
}
export function makeFtPostCondition(options: FtPostConditionsOptions): PostCondition {
  const { amount, contractAddress, contractAssetName, contractName, stxAddress } = options;

  return {
    type: 'ft-postcondition',
    address: stxAddress,
    condition: 'eq',
    amount: new BN(amount, 10).toString(),
    asset: formatAssetString({ contractAddress, contractName, assetName: contractAssetName }),
  };
}
