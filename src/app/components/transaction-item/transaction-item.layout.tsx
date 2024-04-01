import { ReactNode } from 'react';

import { HStack, styled } from 'leather-styles/jsx';

import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { Pressable } from '@app/ui/components/pressable/pressable';
import { Caption } from '@app/ui/components/typography/caption';

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
        img={txIcon && txIcon}
        titleLeft={txTitle}
        captionLeft={
          <HStack alignItems="center">
            <Caption>{txCaption}</Caption>
            {txStatus && txStatus}
          </HStack>
        }
        titleRight={
          rightElement ? rightElement : <styled.span textStyle="label.02">{txValue}</styled.span>
        }
      />
    </Pressable>
  );
}
