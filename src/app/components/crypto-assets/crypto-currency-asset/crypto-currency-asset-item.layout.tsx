import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Flex, styled } from 'leather-styles/jsx';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

import { AssetRowGrid } from '../components/asset-row-grid';

interface CryptoCurrencyAssetItemLayoutProps {
  balance: Money;
  caption: string;
  icon: React.ReactNode;
  copyIcon?: React.ReactNode;
  isPressable?: boolean;
  title: string;
  usdBalance?: string;
  address?: string;
  isHovered?: boolean;
  currency?: CryptoCurrencies;
  additionalBalanceInfo?: React.ReactNode;
  additionalUsdBalanceInfo?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick?(): void;
}
export function CryptoCurrencyAssetItemLayout({
  balance,
  caption,
  icon,
  copyIcon,
  isPressable,
  title,
  usdBalance,
  address = '',
  isHovered = false,
  additionalBalanceInfo,
  additionalUsdBalanceInfo,
  rightElement,
  onClick,
}: CryptoCurrencyAssetItemLayoutProps) {
  const [component, bind] = usePressable(isPressable);

  const amount = balance.decimals
    ? ftDecimals(balance.amount, balance.decimals)
    : balance.amount.toString();
  const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
    '{symbol}',
    balance.symbol.toLowerCase()
  );
  const formattedBalance = formatBalance(amount);

  return (
    <Flex data-testid={dataTestId} onClick={isPressable ? onClick : undefined} {...bind}>
      <Flag
        align="middle"
        img={isHovered && copyIcon ? copyIcon : icon}
        spacing="space.04"
        width="100%"
      >
        <AssetRowGrid
          title={
            <styled.span textStyle="label.01">
              {isHovered ? truncateMiddle(address, 6) : title}
            </styled.span>
          }
          balance={
            <BasicTooltip
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              side="left"
            >
              <styled.span data-testid={title} textStyle="label.01">
                {formattedBalance.value} {additionalBalanceInfo}
              </styled.span>
            </BasicTooltip>
          }
          caption={
            <styled.span textStyle="caption.02" color="accent.text-subdued">
              {caption}
            </styled.span>
          }
          usdBalance={
            <Flex justifyContent="flex-end">
              {balance.amount.toNumber() > 0 && address ? (
                <styled.span textStyle="caption.02" color="accent.text-subdued">
                  {usdBalance}
                </styled.span>
              ) : null}
              {additionalUsdBalanceInfo}
            </Flex>
          }
          rightElement={rightElement}
        />
      </Flag>
      {component}
    </Flex>
  );
}
