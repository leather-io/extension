import { forwardRef } from 'react';
import { StackProps } from '@stacks/ui';
import { ftDecimals, stacksValue } from '@app/common/stacks-utils';
import { AssetWithMeta } from '@app/common/asset-types';
import { getAssetName } from '@stacks/ui-utils';
import { AssetItem } from '@app/components/asset-item';
import { formatContractId, getTicker } from '@app/common/utils';
import { useCurrentAccountAvailableStxBalance } from '@app/query/balance/balance.hooks';
import { BigNumber } from 'bignumber.js';
import { imageCanonicalUriFromFtMetadata } from '@app/common/token-utils';

interface AssetRowProps extends StackProps {
  asset: AssetWithMeta;
}
export const AssetRow = forwardRef<HTMLDivElement, AssetRowProps>((props, ref) => {
  const { asset, ...rest } = props;
  const { name, contractAddress, contractName, type, meta, subtitle, balance, subBalance } = asset;
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  const friendlyName =
    type === 'ft' ? meta?.name || (name.includes('::') ? getAssetName(name) : name) : name;
  const symbol = type === 'ft' ? meta?.symbol || getTicker(friendlyName) : subtitle;

  const valueFromBalance = (balance: BigNumber) =>
    type === 'ft'
      ? ftDecimals(balance, meta?.decimals || 0)
      : type === 'stx'
      ? stacksValue({ value: balance || 0, withTicker: false })
      : balance.toString();

  const correctBalance = availableStxBalance && type === 'stx' ? availableStxBalance : balance;
  const amount = valueFromBalance(correctBalance);
  const subAmount = subBalance && valueFromBalance(subBalance);
  const isDifferent = subBalance && !correctBalance.isEqualTo(subBalance);
  const imageCanonicalUri = imageCanonicalUriFromFtMetadata(meta);

  return (
    <AssetItem
      ref={ref}
      avatar={
        name === 'stx'
          ? 'stx'
          : type === 'ft'
          ? `${formatContractId(contractAddress, contractName)}::${name}`
          : name
      }
      imageCanonicalUri={imageCanonicalUri}
      title={friendlyName}
      caption={symbol}
      amount={amount}
      subAmount={subAmount}
      isDifferent={isDifferent}
      name={name}
      data-testid={`asset-${name}`}
      {...(rest as any)}
    />
  );
});
