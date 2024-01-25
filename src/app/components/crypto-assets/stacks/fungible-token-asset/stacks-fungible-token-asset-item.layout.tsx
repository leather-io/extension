import { Flex, FlexProps, styled } from 'leather-styles/jsx';

import type { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { AssetCaption } from '../../components/asset-caption';
import { AssetRowGrid } from '../../components/asset-row-grid';

interface StacksFungibleTokenAssetItemLayoutProps extends FlexProps {
  avatar: string;
  balance: Money;
  caption: string;
  imageCanonicalUri?: string;
  isPressable?: boolean;
  title: string;
  onClick?(): void;
}
export function StacksFungibleTokenAssetItemLayout({
  avatar,
  balance,
  caption,
  imageCanonicalUri,
  isPressable,
  title,
  onClick,
}: StacksFungibleTokenAssetItemLayoutProps) {
  const [component, bind] = usePressable(isPressable);

  const amount = balance.decimals
    ? ftDecimals(balance.amount, balance.decimals || 0)
    : balance.amount.toString();
  const formattedBalance = formatBalance(amount);

  return (
    <Flex onClick={isPressable ? onClick : undefined} {...bind}>
      <Flag
        align="middle"
        img={
          <StacksAssetAvatar
            color="white"
            gradientString={avatar}
            imageCanonicalUri={imageCanonicalUri}
          >
            {title[0]}
          </StacksAssetAvatar>
        }
        spacing="space.04"
        width="100%"
      >
        <AssetRowGrid
          title={<styled.span textStyle="label.01">{title}</styled.span>}
          balance={
            <BasicTooltip label={formattedBalance.isAbbreviated ? amount : undefined} side="left">
              <styled.span data-testid={title} textStyle="label.01">
                {formattedBalance.value}
              </styled.span>
            </BasicTooltip>
          }
          caption={<AssetCaption caption={caption} />}
        />
        {component}
      </Flag>
    </Flex>
  );
}
