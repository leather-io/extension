import { Box, Flex, Stack } from '@stacks/ui';
import { HStack } from 'leather-styles/jsx';

interface TransactionItemLayoutProps {
  openTxLink(): void;
  txCaption: JSX.Element;
  txTitle: JSX.Element;
  txValue: JSX.Element;
  txIcon?: JSX.Element;
  txStatus?: JSX.Element;
  belowCaptionEl?: JSX.Element;
  children?: JSX.Element;
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
      <Stack
        alignItems="center"
        isInline
        onClick={openTxLink}
        position="relative"
        spacing="base-loose"
        zIndex={2}
      >
        {txIcon && txIcon}
        <Flex flexDirection="column" justifyContent="space-between" flexGrow={1} minWidth="0px">
          <HStack alignItems="center" gap="space.06" justifyContent="space-between">
            {txTitle} {txValue}
          </HStack>
          <Stack alignItems="center" isInline>
            {txCaption} {txStatus && txStatus}
            {belowCaptionEl ? belowCaptionEl : null}
          </Stack>
        </Flex>
      </Stack>
      {children}
    </Box>
  );
}
