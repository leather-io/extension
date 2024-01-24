import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { Flex, styled } from 'leather-styles/jsx';

interface BitcoinContractEmergencyRefundTimeProps {
  emergencyRefundTime: string;
}
export function BitcoinContractEmergencyRefundTime({
  emergencyRefundTime,
}: BitcoinContractEmergencyRefundTimeProps) {
  return (
    <Flex gap="space.05" justifyContent="space-between" p="space.05" width="100%">
      <styled.span fontWeight={500} textStyle="body.01">
        Emergency Refund Time
      </styled.span>
      <styled.span
        data-testid={BitcoinContractRequestSelectors.BitcoinContractExpirationDate}
        textStyle="body.01"
      >
        {emergencyRefundTime}
      </styled.span>
    </Flex>
  );
}
