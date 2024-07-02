import { useCallback } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';
import { Box } from 'leather-styles/jsx';

import type { Money } from '@leather.io/models';
import { Link } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { useToast } from '@app/features/toasts/use-toast';

interface SendMaxButtonProps {
  balance: Money;
  sendMaxBalance: string;
}
export function SendMaxButton({ balance, sendMaxBalance, ...props }: SendMaxButtonProps) {
  const [, _, amountFieldHelpers] = useField('amount');
  const toast = useToast();

  const onSendMax = useCallback(() => {
    void analytics.track('select_maximum_amount_for_send');
    if (balance.amount.isLessThanOrEqualTo(0)) {
      toast.error('Zero balance');
      return;
    }
    return amountFieldHelpers.setValue(sendMaxBalance);
  }, [amountFieldHelpers, balance.amount, sendMaxBalance, toast]);

  // Hide send max button if lowest fee calc is greater
  // than available balance which will default to zero
  if (sendMaxBalance === '0') return <Box height="32px" />;

  return (
    <Link data-testid={SendCryptoAssetSelectors.SendMaxBtn} onClick={onSendMax} {...props}>
      Send max
    </Link>
  );
}
