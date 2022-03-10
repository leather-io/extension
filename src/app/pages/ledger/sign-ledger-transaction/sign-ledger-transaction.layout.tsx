import { color, Box, Flex, Text } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer';
import SignLedgerTransaction from '@assets/images/ledger/sign-ledger-transaction.png';

import { LedgerDrawerType, LedgerTitle } from '../components/ledger-title';
import { Caption } from '@app/components/typography';

interface SignLedgerTransactionLayoutProps {
  onCancelSignTransaction(): void;
}
export function SignLedgerTransactionLayout(props: SignLedgerTransactionLayoutProps) {
  const { onCancelSignTransaction } = props;

  return (
    <BaseDrawer title={<Box />} isShowing onClose={onCancelSignTransaction}>
      <Flex alignItems="center" flexDirection="column" pb="loose" px="loose" textAlign="center">
        <Box mt="tight">
          <img src={SignLedgerTransaction} width="228px" />
        </Box>
        <LedgerTitle mt="loose" mx="50px" type={LedgerDrawerType.Transaction} />
        <Flex
          bg={color('bg-4')}
          borderRadius="16px"
          flexDirection="column"
          mt="loose"
          textAlign="left"
          p="extra-loose"
          width="100%"
        >
          <Flex borderBottom="1px solid" borderColor="#DCDDE2" flexDirection="column">
            <Caption>Name</Caption>
            <Text my="base">fara</Text>
          </Flex>
          <Flex borderBottom="1px solid" borderColor="#DCDDE2" flexDirection="column" mt="base">
            <Caption>Namespace</Caption>
            <Text my="base">.btc</Text>
          </Flex>
          <Flex borderBottom="1px solid" borderColor="#DCDDE2" flexDirection="column" mt="base">
            <Caption>Salt</Caption>
            <Text my="base" overflowWrap="break-word">
              0x6107042955a60edfeaace4f572867272cbef73bb
            </Text>
          </Flex>
          <Flex borderBottom="1px solid" borderColor="#DCDDE2" flexDirection="column" mt="base">
            <Caption>Zonefile-hash</Caption>
            <Text my="base" overflowWrap="break-word">
              0x081173883a64852ee466764b36a4f50d33f12c91
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </BaseDrawer>
  );
}
