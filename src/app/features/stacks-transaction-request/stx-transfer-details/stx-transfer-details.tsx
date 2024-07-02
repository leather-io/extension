import { Stack } from 'leather-styles/jsx';

import { Title } from '@leather.io/ui';

import { AttachmentRow } from '@app/features/stacks-transaction-request/attachment-row';
import { Row } from '@app/features/stacks-transaction-request/row';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

export function StxTransferDetails(): React.JSX.Element | null {
  const pendingTransaction = useTransactionRequestState();

  if (!pendingTransaction || pendingTransaction.txType !== 'token_transfer') {
    return null;
  }

  return (
    <Stack
      border="active"
      borderRadius="sm"
      mb="space.05"
      px="space.04"
      py="space.06"
      gap="space.05"
    >
      <Title>Transfer details</Title>
      <Stack gap="space.04">
        <Row name="Recipient" type="Principal" value={pendingTransaction.recipient} />
        <Row name="Amount" type="uSTX" value={pendingTransaction.amount} />
        {pendingTransaction.memo && (
          <Row name="Memo" type="string" value={pendingTransaction.memo} />
        )}
        {pendingTransaction.attachment && <AttachmentRow />}
      </Stack>
    </Stack>
  );
}
