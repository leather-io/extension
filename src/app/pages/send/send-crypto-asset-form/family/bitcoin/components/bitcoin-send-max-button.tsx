import { Box, Button, color } from '@stacks/ui';
import { ButtonProps } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { Money } from '@shared/models/money.model';

import { Tooltip } from '@app/components/tooltip';

import { useSendMax } from '../hooks/use-send-max';

const sendMaxTooltipLabel = 'This amount is affected by the fee you choose';

interface BitcoinSendMaxButtonProps extends ButtonProps {
  balance: Money;
  isSendingMax?: boolean;
  onSetIsSendingMax(value: boolean): void;
  sendMaxBalance: string;
  sendMaxFee: string;
}
export function BitcoinSendMaxButton({
  balance,
  isSendingMax,
  onSetIsSendingMax,
  sendMaxBalance,
  sendMaxFee,
  ...props
}: BitcoinSendMaxButtonProps) {
  const onSendMax = useSendMax({
    balance,
    isSendingMax,
    onSetIsSendingMax,
    sendMaxBalance,
    sendMaxFee,
  });

  // Hide send max button if lowest fee calc is greater
  // than available balance which will default to zero
  if (sendMaxBalance === '0') return <Box height="32px" />;

  return (
    <Tooltip
      label={sendMaxTooltipLabel}
      labelProps={{ padding: 'tight', textAlign: 'center' }}
      maxWidth="220px"
      placement="bottom"
    >
      <Button
        _hover={{ bg: isSendingMax ? color('border') : color('bg') }}
        bg={isSendingMax ? color('border') : color('bg')}
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
        {isSendingMax ? 'Sending max' : 'Send max'}
      </Button>
    </Tooltip>
  );
}
