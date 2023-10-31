import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { Flex } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

interface BitcoinContractExpirationDateProps {
  expirationDate: string;
}
export function BitcoinContractExpirationDate({
  expirationDate,
}: BitcoinContractExpirationDateProps) {
  return (
    <Flex gap="space.05" justifyContent="space-between" p="space.05" width="100%">
      <styled.span fontWeight={500} textStyle="body.01">
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
