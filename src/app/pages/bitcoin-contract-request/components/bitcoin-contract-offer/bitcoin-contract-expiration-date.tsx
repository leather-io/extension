import { Flex } from '@stacks/ui';
import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { styled } from 'leather-styles/jsx';

interface BitcoinContractExpirationDateProps {
  expirationDate: string;
}
export function BitcoinContractExpirationDate({
  expirationDate,
}: BitcoinContractExpirationDateProps) {
  return (
    <Flex p="loose" spacing="loose" width="100%" justifyContent="space-between">
      <styled.span fontWeight="bold" textStyle="body.01">
        Expiration Date
      </styled.span>
      <styled.span
        data-testid={BitcoinContractRequestSelectors.BitcoinContractExpirationDate}
        textStyle="body.01"
      >
        {expirationDate}
      </styled.span>
    </Flex>
  );
}
