import { StackProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

import type { AllCryptoCurrencyAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { CryptoCurrencyAssetItemLayout } from './crypto-currency-asset-item.layout';

interface CryptoCurrencyAssetItemProps extends StackProps {
  assetBalance: AllCryptoCurrencyAssetBalances;
  assetSubBalance?: AllCryptoCurrencyAssetBalances;
  icon: JSX.Element;
  isPressable?: boolean;
  address: string;
}
export const CryptoCurrencyAssetItem = forwardRefWithAs(
  (props: CryptoCurrencyAssetItemProps, ref) => {
    const { assetBalance, assetSubBalance, icon, isPressable, address, ...rest } = props;
    const { balance, asset } = assetBalance;

    return (
      <CryptoCurrencyAssetItemLayout
        balance={balance}
        caption={assetBalance.balance.symbol}
        icon={icon}
        isPressable={isPressable}
        ref={ref}
        subBalance={assetSubBalance?.balance}
        title={asset.name}
        address={address}
        {...rest}
      />
    );
  }
);
