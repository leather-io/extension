import { Flex, styled } from 'leather-styles/jsx';

interface BitcoinCustomFeeFiatProps {
  feeInBtc: string;
  fiatFeeValue: string;
}

export function BitcoinCustomFeeFiat({ feeInBtc, fiatFeeValue }: BitcoinCustomFeeFiatProps) {
  return (
    <Flex justifyContent="space-between">
      <styled.span color="ink.text-subdued" textStyle="body.02">
        {fiatFeeValue}
      </styled.span>
      <styled.span color="ink.text-subdued" textStyle="body.02">
        {feeInBtc} BTC
      </styled.span>
    </Flex>
  );
}
