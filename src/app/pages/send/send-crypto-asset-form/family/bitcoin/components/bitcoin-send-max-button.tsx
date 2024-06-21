import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Box } from 'leather-styles/jsx';

import type { Money } from '@leather.io/models';
import { Link } from '@leather.io/ui';

import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { useSendMax } from '../hooks/use-send-max';

const sendMaxTooltipLabel = 'This amount is affected by the fee you choose';

interface BitcoinSendMaxButtonProps {
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
    <BasicTooltip label={sendMaxTooltipLabel} side="bottom" asChild>
      <Link
        data-testid={SendCryptoAssetSelectors.SendMaxBtn}
        onClick={() => onSendMax()}
        {...props}
      >
        {isSendingMax ? 'Sending max' : 'Send max'}
      </Link>
    </BasicTooltip>
  );
}
