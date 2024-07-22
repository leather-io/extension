import { styled } from 'leather-styles/jsx';

import type { Money } from '@leather.io/models';
import { formatMoney } from '@leather.io/utils';

interface ChooseFeeAmountProps {
  amount: Money;
  showError: boolean;
}

export function ChooseFeeAmount({ amount, showError }: ChooseFeeAmountProps) {
  return (
    <styled.h3 textStyle="heading.03" color={showError ? 'red.action-primary-default' : 'unset'}>
      {formatMoney(amount)}
    </styled.h3>
  );
}
