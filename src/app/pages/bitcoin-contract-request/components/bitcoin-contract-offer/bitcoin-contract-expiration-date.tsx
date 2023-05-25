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
    <Flex flex={1} width={'284.16px'} paddingLeft={'24px'} paddingRight={'24px'}>
      <SpaceBetween width={'100%'}>
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
