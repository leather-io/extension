import { Flex } from '@stacks/ui';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
// #4383 FIXME - need to refactor this flex as=
// import { Flex } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { Tooltip } from '@app/components/tooltip';
import { truncateMiddle } from '@app/ui/utils/truncateMiddle';

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
  canCopy?: boolean;
  isHovered?: boolean;
  currency?: CryptoCurrencies;
  additionalBalanceInfo?: React.ReactNode;
  additionalUsdBalanceInfo?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
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
  onMouseOver,
  onMouseOut,
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
    <Flex
      // #4383 FIXME - need test this properly
      // - make sure onMouse works without ref
      // as={isPressable ? 'button' : 'div'}
      // changed to onClick={isPressable ? onClick : undefined}
      data-testid={dataTestId}
      outline={0}
      onClick={isPressable ? onClick : undefined}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      {...bind}
    >
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
            <Tooltip
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              placement="left-start"
            >
              <styled.span data-testid={title} textStyle="label.01">
                {formattedBalance.value} {additionalBalanceInfo}
              </styled.span>
            </Tooltip>
          }
          caption={<styled.span textStyle="caption.02">{caption}</styled.span>}
          usdBalance={
            <Flex justifyContent="flex-end">
              {balance.amount.toNumber() > 0 && address ? (
                <styled.span textStyle="caption.02">{usdBalance}</styled.span>
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
