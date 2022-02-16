import { Stack } from '@stacks/ui';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { BaseDrawer, BaseDrawerProps } from '@app/components/drawer';

import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';
import { TransactionFee } from '@app/components/fee-row/components/transaction-fee';
import {
  useLocalTransactionInputsState,
  useUnsignedTxForSettingsState,
} from '@app/store/transactions/transaction.hooks';

import { SendTokensConfirmActions } from './send-tokens-confirm-actions';
import { useEffect } from 'react';
import { SendTokensConfirmDetails } from './send-tokens-confirm-details';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

interface SendTokensSoftwareConfirmDrawerProps extends BaseDrawerProps {
  onUserSelectBroadcastTransaction(): void;
}
export function SendTokensSoftwareConfirmDrawer(props: SendTokensSoftwareConfirmDrawerProps) {
  const { isShowing, onClose, onUserSelectBroadcastTransaction } = props;

  const [txData] = useLocalTransactionInputsState();
  const transaction = useUnsignedTxForSettingsState();
  const analytics = useAnalytics();
  const { showEditNonce } = useDrawers();

  useEffect(() => {
    if (!isShowing) return;
    void analytics.track('view_transaction_signing');
  }, [isShowing, analytics]);

  if (!isShowing || !transaction || !txData) return null;

  return (
    <BaseDrawer
      title="Confirm transfer"
      isShowing={isShowing}
      onClose={onClose}
      pauseOnClickOutside={showEditNonce}
    >
      <Stack pb="extra-loose" px="loose" spacing="loose">
        <SendTokensConfirmDetails
          amount={txData.amount}
          recipient={txData.recipient}
          nonce={Number(transaction?.auth.spendingCondition?.nonce)}
        />
        <SpaceBetween>
          <Caption>Fees</Caption>
          <Caption>
            <TransactionFee fee={txData.fee} />
          </Caption>
        </SpaceBetween>
        <SendTokensConfirmActions
          transaction={transaction}
          onUserConfirmBroadcast={() => onUserSelectBroadcastTransaction()}
        />
      </Stack>
    </BaseDrawer>
  );
}
