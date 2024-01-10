import { useMemo } from 'react';

import { useField } from 'formik';
import { Flex, styled } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';

import { satToBtc } from '@app/common/money/unit-conversion';

import { useBitcoinCustomFee } from './hooks/use-bitcoin-custom-fee';

interface BitcoinCustomFeeFiatProps {
  amount: number;
  isSendingMax: boolean;
  recipient: string;
}

export function BitcoinCustomFeeFiat({
  amount,
  isSendingMax,
  recipient,
}: BitcoinCustomFeeFiatProps) {
  const [field] = useField('feeRate');
  const getCustomFeeValues = useBitcoinCustomFee({
    amount: createMoney(amount, 'BTC'),
    isSendingMax,
    recipient,
  });

  const feeData = useMemo(() => {
    const { fee, fiatFeeValue } = getCustomFeeValues(Number(field.value));
    const feeInBtc = satToBtc(fee).toString();

    return { fiatFeeValue, feeInBtc };
  }, [getCustomFeeValues, field.value]);

  const canShow = !feeData.feeInBtc.includes('e') && Number(field.value) > 0;
  if (!canShow) return null;

  return (
    <Flex justifyContent="space-between">
      <styled.span color="accent.text-subdued" textStyle="body.02">
        {feeData.fiatFeeValue}
      </styled.span>
      <styled.span color="accent.text-subdued" textStyle="body.02">
        {feeData.feeInBtc} BTC
      </styled.span>
    </Flex>
  );
}
