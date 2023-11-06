import { useState } from 'react';
import { toast } from 'react-hot-toast';

import type { AllCryptoCurrencyAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { spamFilter } from '@app/common/utils/spam-filter';
import { forwardRefWithAs } from '@app/common/utils/stacks-ui/core/forwardRefWithAs';

import { AssetItemCopyIcon } from './asset-copy-icon';
import { CryptoCurrencyAssetItemLayout } from './crypto-currency-asset-item.layout';

interface CryptoCurrencyAssetItemProps {
  assetBalance: AllCryptoCurrencyAssetBalances;
  icon: React.ReactNode;
  usdBalance?: string;
  address?: string;
  isPressable?: boolean;
  canCopy?: boolean;
  additionalBalanceInfo?: React.ReactNode;
  additionalUsdBalanceInfo?: React.ReactNode;
  rightElement?: React.ReactNode;
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
      rightElement,
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
        title={spamFilter(asset.name)}
        isHovered={isHovered}
        address={address}
        usdBalance={usdBalance}
        onClick={onClick}
        onMouseOver={onHover}
        onMouseOut={onBlur}
        additionalBalanceInfo={additionalBalanceInfo}
        additionalUsdBalanceInfo={additionalUsdBalanceInfo}
        rightElement={rightElement}
        {...rest}
      />
    );
  }
);
