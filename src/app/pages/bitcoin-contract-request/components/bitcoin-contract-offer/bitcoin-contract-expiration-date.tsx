import { Flex } from '@stacks/ui';

import { SpaceBetween } from '@app/components/layout/space-between';
import { Text } from '@app/components/typography';

interface BitcoinContractExpirationDateProps {
  expirationDate: string;
}
export function BitcoinContractExpirationDate({
  expirationDate,
}: BitcoinContractExpirationDateProps) {
  return (
    <Flex>
      <SpaceBetween spacing='base'>
        <Text fontSize={2} fontWeight="500">
          Expiration Date
        </Text>
        <Text fontSize={1} textAlign="right">
          {expirationDate}
        </Text>
      </SpaceBetween>
    </Flex>
  );
}
