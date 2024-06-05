import { ReactNode } from 'react';

import { HStack, VStack, styled } from 'leather-styles/jsx';

import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { Caption } from '@app/ui/components/typography/caption';
import { Pressable } from '@app/ui/pressable/pressable';

interface TransactionItemLayoutProps {
  openTxLink(): void;
  actionButtonGroupElement?: ReactNode;
  txCaption: ReactNode;
  txTitle: ReactNode;
  txValue: ReactNode;
  txIcon?: ReactNode;
  txStatus?: ReactNode;
  children?: ReactNode;
}

export function TransactionItemLayout({
  openTxLink,
  actionButtonGroupElement,
  txCaption,
  txIcon,
  txStatus,
  txTitle,
  txValue,
}: TransactionItemLayoutProps) {
  return (
    <Pressable onClick={openTxLink} my="space.02">
      <ItemLayout
        flagImg={txIcon && txIcon}
        titleLeft={txTitle}
        captionLeft={
          <VStack alignItems="start" gap="space.01">
            <HStack alignItems="center">
              <Caption
                overflow="hidden"
                textOverflow="ellipsis"
                maxWidth={{ base: '160px', md: 'unset' }}
              >
                {txCaption}
              </Caption>
              {txStatus && txStatus}
            </HStack>
            {actionButtonGroupElement && actionButtonGroupElement}
          </VStack>
        }
        titleRight={
          !actionButtonGroupElement && <styled.span textStyle="label.02">{txValue}</styled.span>
        }
      />
    </Pressable>
  );
}
