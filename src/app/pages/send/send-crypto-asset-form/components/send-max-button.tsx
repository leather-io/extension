import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@stacks/ui';
import { ButtonProps } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';

import { Money } from '@shared/models/money.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

interface SendMaxButtonProps extends ButtonProps {
  balance: Money;
  sendMaxBalance: string;
}
export function SendMaxButton({ balance, sendMaxBalance, ...props }: SendMaxButtonProps) {
  const [, _, amountFieldHelpers] = useField('amount');

  const analytics = useAnalytics();

  const onSendMax = useCallback(() => {
    // if (isUndefined(feeField.value)) return toast.error('Loading fee, try again');
    // if (!feeField.value)
    //   return toast.error(
    //     `A fee must be set to calculate max ${balance.symbol.toUpperCase()} transfer amount`
    //   );

    void analytics.track('select_maximum_amount_for_send');
    if (balance.amount.isLessThanOrEqualTo(0)) return toast.error(`Zero balance`);
    return amountFieldHelpers.setValue(sendMaxBalance);
  }, [amountFieldHelpers, analytics, balance.amount, sendMaxBalance]);

  return (
    <Button
      borderRadius="10px"
      data-testid={SendCryptoAssetSelectors.SendMaxBtn}
      fontSize={0}
      height="32px"
      onClick={onSendMax}
      mode="tertiary"
      px="base-tight"
      type="button"
      width="fit-content"
      {...props}
    >
      Send max
    </Button>
  );
}
