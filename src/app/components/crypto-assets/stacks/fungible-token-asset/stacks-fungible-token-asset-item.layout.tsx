import { BoxProps, Flex } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

import type { Money } from '@shared/models/money.model';

import { getFormattedBalance } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { ftDecimals } from '@app/common/stacks-utils';
import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';
import { usePressable } from '@app/components/item-hover';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';
import { Text } from '@app/components/typography';

import { AssetCaption } from '../../components/asset-caption';
import { SubBalance } from '../../components/sub-balance';

interface StacksFungibleTokenAssetItemLayoutProps extends BoxProps {
  avatar: string;
  balance: Money;
  caption: string;
  imageCanonicalUri?: string;
  isPressable?: boolean;
  subBalance?: Money;
  title: string;
}
export const StacksFungibleTokenAssetItemLayout = forwardRefWithAs(
  (props: StacksFungibleTokenAssetItemLayoutProps, ref) => {
    const { avatar, balance, caption, imageCanonicalUri, isPressable, subBalance, title, ...rest } =
      props;
    const [component, bind] = usePressable(isPressable);

    const amount = balance.decimals
      ? ftDecimals(balance.amount, balance.decimals || 0)
      : balance.amount.toString();
    const formattedBalance = getFormattedBalance(amount);
    const isUnanchored =
      subBalance?.amount.isGreaterThan(0) && !balance.amount.isEqualTo(subBalance.amount);

    return (
      <Flex as={isPressable ? 'button' : 'div'} outline={0} ref={ref} {...rest} {...bind}>
        <Flag
          align="middle"
          img={
            <StacksAssetAvatar
              color="white"
              gradientString={avatar}
              imageCanonicalUri={imageCanonicalUri}
              isUnanchored={isUnanchored}
              size="36px"
            >
              {title[0]}
            </StacksAssetAvatar>
          }
          width="100%"
        >
          <SpaceBetween width="100%">
            <Text>{title}</Text>
            <Tooltip
              label={formattedBalance.isAbbreviated ? amount : undefined}
              placement="left-start"
            >
              <Text data-testid={title} fontVariantNumeric="tabular-nums" textAlign="right">
                {formattedBalance.value}
              </Text>
            </Tooltip>
          </SpaceBetween>
          <SpaceBetween height="1.25rem" width="100%">
            <AssetCaption caption={caption} isUnanchored={isUnanchored} />
            {isUnanchored && subBalance ? <SubBalance balance={subBalance} /> : null}
          </SpaceBetween>
          {component}
        </Flag>
      </Flex>
    );
  }
);
