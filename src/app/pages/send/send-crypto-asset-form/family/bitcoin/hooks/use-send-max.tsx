import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useField } from 'formik';

import { Money } from '@shared/models/money.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

interface UseSendMaxArgs {
  balance: Money;
  isSendingMax?: boolean;
  onSetIsSendingMax(value: boolean): void;
  sendMaxBalance: string;
  sendMaxFee: string;
}
export function useSendMax({
  balance,
  isSendingMax,
  onSetIsSendingMax,
  sendMaxBalance,
  sendMaxFee,
}: UseSendMaxArgs) {
  const [, _, amountFieldHelpers] = useField('amount');
  const [, __, feeFieldHelpers] = useField('fee');

  const analytics = useAnalytics();

  return useCallback(() => {
    void analytics.track('select_maximum_amount_for_send');
    if (balance.amount.isLessThanOrEqualTo(0)) return toast.error(`Zero balance`);
    onSetIsSendingMax(!isSendingMax);
    amountFieldHelpers.setError('');
    feeFieldHelpers.setValue(sendMaxFee);
    return amountFieldHelpers.setValue(sendMaxBalance);
  }, [
    amountFieldHelpers,
    analytics,
    balance.amount,
    feeFieldHelpers,
    isSendingMax,
    onSetIsSendingMax,
    sendMaxBalance,
    sendMaxFee,
  ]);
}
