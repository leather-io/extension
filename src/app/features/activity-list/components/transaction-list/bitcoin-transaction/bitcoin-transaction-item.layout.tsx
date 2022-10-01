import { Box, Flex, Stack } from '@stacks/ui';

import { usePressable } from '@app/components/item-hover';
import { SpaceBetween } from '@app/components/space-between';

interface BitcoinTransactionItemLayoutProps {
  openTxLink(): void;
  txCaption: JSX.Element;
  txIcon: JSX.Element;
  txStatus: JSX.Element;
  txTitle: JSX.Element;
  txValue: JSX.Element;
}
export function BitcoinTransactionItemLayout({
  openTxLink,
  txCaption,
  txIcon,
  txStatus,
  txTitle,
  txValue,
  ...rest
}: BitcoinTransactionItemLayoutProps) {
  const [component, bind] = usePressable(true);

  return (
    <Box position="relative" cursor="pointer" {...bind} {...rest}>
      <Stack
        alignItems="center"
        isInline
        onClick={openTxLink}
        position="relative"
        spacing="base-loose"
        zIndex={2}
      >
        {txIcon}
        <Flex flexDirection="column" flexGrow={1} minWidth="0px">
          <SpaceBetween spacing="extra-loose">
            {txTitle} {txValue}
          </SpaceBetween>
          <Stack alignItems="center" isInline>
            {txCaption} {txStatus}
          </Stack>
        </Flex>
      </Stack>
      {component}
    </Box>
  );
}
