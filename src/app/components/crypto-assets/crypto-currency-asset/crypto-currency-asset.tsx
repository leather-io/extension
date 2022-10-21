import { forwardRef } from 'react';
import { StackProps } from '@stacks/ui';

import type {
  BitcoinCryptoCurrencyAssetBalance,
  StacksCryptoCurrencyAssetBalance,
} from '@shared/models/crypto-asset-balance.model';

import { CryptoCurrencyAssetLayout } from './crypto-currency-asset.layout';

interface CryptoCurrencyAssetProps extends StackProps {
  assetBalance: BitcoinCryptoCurrencyAssetBalance | StacksCryptoCurrencyAssetBalance;
  icon: JSX.Element;
}
export const CryptoCurrencyAsset = forwardRef((props: CryptoCurrencyAssetProps, ref) => {
  const { assetBalance, icon, ...rest } = props;
  const { balance, asset } = assetBalance;

  const hasSubBalance = !!('subBalance' in assetBalance);

  return (
    <CryptoCurrencyAssetLayout
      balance={balance}
      caption={assetBalance.balance.symbol}
      icon={icon}
      ref={ref}
      subBalance={hasSubBalance && assetBalance.subBalance}
      title={asset.name}
      {...(rest as any)}
    />
  );
});
