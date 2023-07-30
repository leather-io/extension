import { useMemo } from 'react';

import { Flex, Text } from '@stacks/ui';
import { useField } from 'formik';

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
  const getCustomFeeValues = useBitcoinCustomFee({ amount, isSendingMax, recipient });

  const feeData = useMemo(() => {
    const { fee, fiatFeeValue } = getCustomFeeValues(Number(field.value));
    const feeInBtc = satToBtc(fee).toString();

    return { fiatFeeValue, feeInBtc };
  }, [getCustomFeeValues, field.value]);

  const canShow = !feeData.feeInBtc.includes('e') && Number(field.value) > 0;
  if (!canShow) return null;

  return (
    <Flex justifyContent="space-between" color="#74777D" fontSize="14px">
      <Text>{feeData.fiatFeeValue}</Text>
      <Text>{feeData.feeInBtc} BTC</Text>
    </Flex>
  );
}
