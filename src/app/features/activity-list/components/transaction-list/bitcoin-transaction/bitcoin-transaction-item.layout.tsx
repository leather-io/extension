import { Box, Flex, Stack } from '@stacks/ui';

import { usePressable } from '@app/components/item-hover';
import { SpaceBetween } from '@app/components/layout/space-between';

interface BitcoinTransactionItemLayoutProps {
  openTxLink(): void;
  txCaption: React.JSX.Element;
  txIcon: React.JSX.Element;
  txStatus: React.JSX.Element;
  txTitle: React.JSX.Element;
  txValue: React.JSX.Element;
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
    <Box position="relative" cursor="pointer" onClick={openTxLink} {...bind} {...rest}>
      <Stack alignItems="center" isInline position="relative" spacing="base-loose" zIndex={2}>
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
