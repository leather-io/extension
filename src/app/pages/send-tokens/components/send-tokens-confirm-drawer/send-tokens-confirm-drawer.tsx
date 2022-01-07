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
import { SendTokensConfirmDetails } from './send-tokens-confirm-details';
import { isTxSponsored } from '@app/common/transactions/transaction-utils';

interface SendTokensConfirmDrawerProps extends BaseDrawerProps {
  onUserSelectBroadcastTransaction(): void;
}
export function SendTokensConfirmDrawer(props: SendTokensConfirmDrawerProps) {
  const { isShowing, onClose, onUserSelectBroadcastTransaction } = props;

  const [txData] = useLocalTransactionInputsState();
  const transaction = useUnsignedTxForSettingsState();
  const { showEditNonce } = useDrawers();
  const isSponsored = transaction ? isTxSponsored(transaction) : false;

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
            <TransactionFee isSponsored={isSponsored} fee={txData.fee} />
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
