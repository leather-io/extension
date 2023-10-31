import React from 'react';

import { Box, Flex, HStack } from 'leather-styles/jsx';

interface TransactionItemLayoutProps {
  openTxLink(): void;
  txCaption: React.JSX.Element;
  txTitle: React.JSX.Element;
  txValue: React.JSX.Element;
  txIcon?: React.JSX.Element;
  txStatus?: React.JSX.Element;
  belowCaptionEl?: React.JSX.Element;
  children?: React.JSX.Element;
}
export function TransactionItemLayout({
  openTxLink,
  txCaption,
  txIcon,
  txStatus,
  txTitle,
  txValue,
  belowCaptionEl,
  children,
  ...rest
}: TransactionItemLayoutProps) {
  return (
    <Box position="relative" cursor="pointer" {...rest}>
      <HStack
        alignItems="center"
        gap="space.04"
        onClick={openTxLink}
        position="relative"
        zIndex={2}
      >
        {txIcon && txIcon}
        <Flex flexDirection="column" flexGrow={1} justifyContent="space-between" minWidth="0px">
          <HStack alignItems="center" gap="space.06" justifyContent="space-between">
            {txTitle} {txValue}
          </HStack>
          <HStack alignItems="center">
            {txCaption} {txStatus && txStatus}
            {belowCaptionEl ? belowCaptionEl : null}
          </HStack>
        </Flex>
      </HStack>
      {children}
    </Box>
  );
}
