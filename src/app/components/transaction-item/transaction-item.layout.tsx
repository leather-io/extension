import { ReactNode } from 'react';

import { HStack, styled } from 'leather-styles/jsx';

import { ItemInteractive } from '@app/ui/components/item/item-interactive';
import { ItemLayout } from '@app/ui/components/item/item.layout';
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
    <ItemInteractive onClick={openTxLink} my="space.02">
      <ItemLayout
        flagImg={txIcon && txIcon}
        titleLeft={txTitle}
        captionLeft={
          <HStack alignItems="center">
            <Caption>{txCaption}</Caption>
            {txStatus && txStatus}
          </HStack>
        }
        titleRight={
          rightElement ? (
            rightElement
          ) : (
            <styled.span fontWeight={500} textStyle="label.02">
              {txValue}
            </styled.span>
          )
        }
      />
    </ItemInteractive>
  );
}
