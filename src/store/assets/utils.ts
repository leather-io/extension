import { getAssetStringParts, truncateMiddle } from '@stacks/ui-utils';
import BigNumber from 'bignumber.js';
import type { Asset } from '@common/asset-types';
import type { AccountBalanceResponseBigNumber } from '@store/accounts/types';

function makeKey(networkUrl: string, address: string, name: string, key: string): string {
  return `${networkUrl}__${address}__${name}__${key}`;
}

export function getLocalData(options: {
  networkUrl: string;
  address: string;
  name: string;
  key: string;
}) {
  const { networkUrl, address, name, key } = options;
  const _key = makeKey(networkUrl, address, name, key);
  const value = localStorage.getItem(_key);
  if (!value) return null;
  return JSON.parse(value);
}

export function setLocalData(options: {
  networkUrl: string;
  address: string;
  name: string;
  key: string;
  data: any;
}): void {
  const { networkUrl, address, name, data, key } = options;
  const _key = makeKey(networkUrl, address, name, key);
  return localStorage.setItem(_key, JSON.stringify(data));
}

export function transformAssets(balances?: AccountBalanceResponseBigNumber) {
  const _assets: Asset[] = [];
  if (!balances) return _assets;
  _assets.push({
    type: 'stx',
    contractAddress: '',
    contractName: '',
    balance: balances.stx.balance,
    subtitle: 'STX',
    name: 'Stacks Token',
    canTransfer: true,
    hasMemo: true,
  });
  Object.keys(balances.fungible_tokens).forEach(key => {
    const balance = new BigNumber(balances.fungible_tokens[key].balance);
    const { address, contractName, assetName } = getAssetStringParts(key);
    if (balance.isEqualTo(0)) return; // tokens users have traded will persist in the api response even if they don't have a balance
    _assets.push({
      type: 'ft',
      subtitle: `${truncateMiddle(address)}.${contractName}`,
      contractAddress: address,
      contractName,
      name: assetName,
      balance: balance,
    });
  });
  return _assets;
}
