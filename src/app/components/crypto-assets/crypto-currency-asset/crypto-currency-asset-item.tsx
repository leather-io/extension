import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { StackProps, useClipboard } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

import type { AllCryptoCurrencyAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

import { AssetItemCopyIcon } from './asset-copy-icon';
import { CryptoCurrencyAssetItemLayout } from './crypto-currency-asset-item.layout';

interface CryptoCurrencyAssetItemProps extends StackProps {
  assetBalance: AllCryptoCurrencyAssetBalances;
  icon: React.JSX.Element;
  usdBalance?: string;
  address?: string;
  isPressable?: boolean;
  canCopy?: boolean;
  additionalBalanceInfo?: React.JSX.Element;
  additionalUsdBalanceInfo?: React.JSX.Element;
}
export const CryptoCurrencyAssetItem = forwardRefWithAs(
  (props: CryptoCurrencyAssetItemProps, ref) => {
    const {
      assetBalance,
      icon,
      isPressable,
      address,
      canCopy,
      usdBalance,
      additionalBalanceInfo,
      additionalUsdBalanceInfo,
      ...rest
    } = props;
    const { balance, asset } = assetBalance;
    const [isHovered, setIsHovered] = useState(false);
    const { onCopy, hasCopied } = useClipboard(address || '');
    const analytics = useAnalytics();

    function onHover() {
      if (!canCopy) {
        return;
      }
      setIsHovered(true);
    }

    function onBlur() {
      if (!canCopy) {
        return;
      }
      setIsHovered(false);
    }

    function onClick() {
      if (!canCopy) {
        return;
      }
      void analytics.track('copy_address_to_clipboard');
      onCopy();
      toast.success('Address copied!');
    }

    return (
      <CryptoCurrencyAssetItemLayout
        balance={balance}
        caption={assetBalance.balance.symbol}
        icon={icon}
        copyIcon={canCopy ? <AssetItemCopyIcon hasCopied={hasCopied} /> : undefined}
        isPressable={isPressable}
        ref={ref}
        title={asset.name}
        isHovered={isHovered}
        address={address}
        usdBalance={usdBalance}
        onClick={onClick}
        onMouseOver={onHover}
        onMouseOut={onBlur}
        additionalBalanceInfo={additionalBalanceInfo}
        additionalUsdBalanceInfo={additionalUsdBalanceInfo}
        {...rest}
      />
    );
  }
);
