import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@stacks/ui';
import { ButtonProps } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';

import { Money } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

interface SendAllButtonProps extends ButtonProps {
  balance: Money;
  sendAllBalance: string;
}
export function SendAllButton({ balance, sendAllBalance, ...props }: SendAllButtonProps) {
  const [, _, amountFieldHelpers] = useField('amount');
  const [feeField] = useField('fee');
  const analytics = useAnalytics();

  const onSendAll = useCallback(() => {
    if (isUndefined(feeField.value)) return toast.error('Loading fee, try again');
    if (!feeField.value)
      return toast.error(
        `A fee must be set to calculate max ${balance.symbol.toUpperCase()} transfer amount`
      );

    void analytics.track('select_maximum_amount_for_send');
    if (balance.amount.isLessThanOrEqualTo(0)) return toast.error(`Zero balance`);

    return amountFieldHelpers.setValue(sendAllBalance);
  }, [
    amountFieldHelpers,
    analytics,
    balance.amount,
    balance.symbol,
    feeField.value,
    sendAllBalance,
  ]);

  return (
    <Button
      borderRadius="12px"
      data-testid={SendCryptoAssetSelectors.SendAllBtn}
      fontSize={0}
      height="32px"
      onClick={onSendAll}
      mode="tertiary"
      px="tight"
      type="button"
      width="70px"
      {...props}
    >
      Send all
    </Button>
  );
}
