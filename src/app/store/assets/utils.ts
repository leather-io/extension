import { getAssetStringParts, truncateMiddle } from '@stacks/ui-utils';
import BigNumber from 'bignumber.js';
import type { Asset } from '@app/common/asset-types';
import type { AccountBalanceResponseBigNumber } from '@shared/models/account-types';

export function transformAssets(balances?: AccountBalanceResponseBigNumber) {
  const _assets: Asset[] = [];
  if (!balances) return _assets;
  _assets.push({
    type: 'stx',
    contractAddress: '',
    contractName: '',
    balance: balances.stx.balance.amount,
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
