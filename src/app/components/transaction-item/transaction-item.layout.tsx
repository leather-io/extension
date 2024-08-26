import { ReactNode } from 'react';

import { HStack } from 'leather-styles/jsx';

import { Caption, ItemLayout, Pressable } from '@leather.io/ui';

import { HideableBalance } from '@app/components/balance/hideable-balance';

interface TransactionItemLayoutProps {
  openTxLink(): void;
  rightElement?: ReactNode;
  txCaption: ReactNode;
  txTitle: ReactNode;
  txValue: ReactNode;
  txIcon?: ReactNode;
  txStatus?: ReactNode;
  children?: ReactNode;
}

export function TransactionItemLayout({
  openTxLink,
  rightElement,
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
        }
        titleRight={
          rightElement ? (
            rightElement
          ) : (
            <HideableBalance textStyle="label.02">{txValue}</HideableBalance>
          )
        }
      />
    </Pressable>
  );
}
