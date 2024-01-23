import { ReactNode } from 'react';

import { styled } from 'leather-styles/jsx';

import { ItemInteractive } from '@app/ui/components/item/item-interactive';
import { ItemLayout } from '@app/ui/components/item/item.layout';

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
    // TODO: Revisit if needed styles position="relative" zIndex={99}
    <ItemInteractive onClick={openTxLink}>
      <ItemLayout
        flagImg={txIcon && txIcon}
        titleLeft={txTitle}
        captionLeft={
          <>
            <styled.span color="accent.text-subdued" textStyle="caption.01">
              {txCaption}
            </styled.span>
            {txStatus && txStatus}
          </>
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
