import { forwardRef, memo } from 'react';

import { Box, BoxProps, Stack } from '@stacks/ui';
import BigNumber from 'bignumber.js';

import { getFormattedBalance } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';
import { usePressable } from '@app/components/item-hover';
import { SpaceBetween } from '@app/components/space-between';
import { Tooltip } from '@app/components/tooltip';
import { Caption, Text } from '@app/components/typography';

// TODO: This is temporarily a copy of the fungible token layout component
// New designs for this will be implemented when the nft api endpoint is available
interface StacksNonFungibleTokenAssetItemLayoutProps extends BoxProps {
  avatar: string;
  caption: string;
  count: BigNumber;
  imageCanonicalUri?: string;
  isPressable?: boolean;
  title: string;
}
export const StacksNonFungibleTokenAssetItemLayout = memo(
  forwardRef((props: StacksNonFungibleTokenAssetItemLayoutProps, ref) => {
    const { avatar, caption, count, imageCanonicalUri, isPressable, title, ...rest } = props;
    const [component, bind] = usePressable(isPressable);

    const amount = count.toString();
    const formattedBalance = getFormattedBalance(amount);

    return (
      <Box
        as={isPressable ? 'button' : 'div'}
        display="flex"
        textAlign="left"
        outline={0}
        position="relative"
        ref={ref}
        flexGrow={1}
        spacing="base"
        {...rest}
        {...bind}
      >
        <Stack alignItems="center" flexGrow={1} isInline spacing="base">
          <StacksAssetAvatar
            color="white"
            gradientString={avatar}
            imageCanonicalUri={imageCanonicalUri}
            isUnanchored={false}
            size="36px"
          >
            {title[0]}
          </StacksAssetAvatar>
          <Stack flexGrow={1} spacing="none">
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
              <Caption>{caption}</Caption>
            </SpaceBetween>
          </Stack>
        </Stack>
        {component}
      </Box>
    );
  })
);
