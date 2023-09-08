import { Box, Flex, HStack } from 'leather-styles/jsx';

import { SpaceBetween } from '@app/components/layout/space-between';

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
        onClick={openTxLink}
        position="relative"
        gap="base-loose"
        zIndex={2}
      >
        {txIcon && txIcon}
        <Flex flexDirection="column" justifyContent="space-between" flexGrow={1} minWidth="0px">
          <SpaceBetween spacing="space.06">
            {txTitle} {txValue}
          </SpaceBetween>
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
