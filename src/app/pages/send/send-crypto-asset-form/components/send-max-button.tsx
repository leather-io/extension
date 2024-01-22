import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';
import { Box } from 'leather-styles/jsx';

import { Money } from '@shared/models/money.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Link } from '@app/ui/components/link/link';

interface SendMaxButtonProps {
  balance: Money;
  sendMaxBalance: string;
}
export function SendMaxButton({ balance, sendMaxBalance, ...props }: SendMaxButtonProps) {
  const [, _, amountFieldHelpers] = useField('amount');

  const analytics = useAnalytics();

  const onSendMax = useCallback(() => {
    void analytics.track('select_maximum_amount_for_send');
    if (balance.amount.isLessThanOrEqualTo(0)) return toast.error(`Zero balance`);
    return amountFieldHelpers.setValue(sendMaxBalance);
  }, [amountFieldHelpers, analytics, balance.amount, sendMaxBalance]);

  // Hide send max button if lowest fee calc is greater
  // than available balance which will default to zero
  if (sendMaxBalance === '0') return <Box height="32px" />;

  return (
    <Link data-testid={SendCryptoAssetSelectors.SendMaxBtn} onClick={onSendMax} {...props}>
      Send max
    </Link>
  );
}
