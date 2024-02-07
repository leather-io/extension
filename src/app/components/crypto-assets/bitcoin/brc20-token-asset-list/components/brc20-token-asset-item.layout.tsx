import { styled } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';
import { Brc20TokenIcon } from '@app/ui/components/icons/brc20-token-icon';
import { ItemInteractive } from '@app/ui/components/item/item-interactive';
import { ItemLayout } from '@app/ui/components/item/item.layout';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface Brc20TokenAssetItemLayoutProps {
  token: Brc20Token;
  onClick?(): void;
  displayNotEnoughBalance?: boolean;
}
export function Brc20TokenAssetItemLayout({
  onClick,
  displayNotEnoughBalance,
  token,
}: Brc20TokenAssetItemLayoutProps) {
  const balance = createMoney(Number(token.overall_balance), token.tick, 0);
  const formattedBalance = formatBalance(balance.amount.toString());

  return (
    <BasicTooltip
      asChild
      disabled={!displayNotEnoughBalance}
      label="Not enough BTC in balance"
      side="top"
    >
      <ItemInteractive onClick={onClick}>
        <ItemLayout
          flagImg={<Brc20TokenIcon />}
          titleLeft={token.tick}
          captionLeft="BRC-20"
          titleRight={
            <BasicTooltip
              asChild
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              side="left"
            >
              <styled.span data-testid={token.tick} fontWeight={500} textStyle="label.02">
                {formattedBalance.value}
              </styled.span>
            </BasicTooltip>
          }
        />
      </ItemInteractive>
    </BasicTooltip>
  );
}
