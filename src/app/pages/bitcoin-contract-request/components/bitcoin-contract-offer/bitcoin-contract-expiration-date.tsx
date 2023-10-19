import { Flex } from '@stacks/ui';
import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';

import { Text } from '@app/components/typography';

interface BitcoinContractExpirationDateProps {
  expirationDate: string;
}
export function BitcoinContractExpirationDate({
  expirationDate,
}: BitcoinContractExpirationDateProps) {
  return (
    <Flex p="loose" spacing="loose" width="100%" justifyContent="space-between">
      <Text fontSize={2} fontWeight="bold">
        Expiration Date
      </Text>
      <Text
        fontSize={2}
        data-testid={BitcoinContractRequestSelectors.BitcoinContractExpirationDate}
      >
        {expirationDate}
      </Text>
    </Flex>
  );
}
