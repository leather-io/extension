import { ReactNode } from 'react';

import { HStack } from 'leather-styles/jsx';

import { Caption, ItemLayout, Pressable } from '@leather.io/ui';

import { PrivateTextLayout } from '@app/components/privacy/private-text.layout';

interface TransactionItemLayoutProps {
  openTxLink(): void;
  rightElement?: ReactNode;
  txCaption: ReactNode;
  txTitle: ReactNode;
  txValue: ReactNode;
  txIcon?: ReactNode;
  txStatus?: ReactNode;
  children?: ReactNode;
  isPrivate?: boolean;
}

function TxValue({ txValue, isPrivate }: { txValue: ReactNode; isPrivate?: boolean }) {
  return (
    <PrivateTextLayout isPrivate={isPrivate} textStyle="label.02" px="space.02">
      {txValue}
    </PrivateTextLayout>
  );
}

export function TransactionItemLayout({
  openTxLink,
  rightElement,
  txCaption,
  txIcon,
  txStatus,
  txTitle,
  txValue,
  isPrivate,
}: TransactionItemLayoutProps) {
  return (
    <Pressable onClick={openTxLink} my="space.02">
      <ItemLayout
        img={txIcon && txIcon}
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
        titleRight={<TxValue txValue={txValue} isPrivate={isPrivate} />}
        captionRight={rightElement}
      />
    </Pressable>
  );
}
