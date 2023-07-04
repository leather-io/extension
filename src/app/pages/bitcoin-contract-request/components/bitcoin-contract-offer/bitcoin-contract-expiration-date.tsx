import { Flex } from '@stacks/ui';

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
      <Text fontSize={2}>{expirationDate}</Text>
    </Flex>
  );
}
