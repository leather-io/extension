import { Stack } from 'leather-styles/jsx';

import { AttachmentRow } from '@app/features/stacks-transaction-request/attachment-row';
import { Row } from '@app/features/stacks-transaction-request/row';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { Title } from '@app/ui/components/typography/title';

export function StxTransferDetails(): React.JSX.Element | null {
  const pendingTransaction = useTransactionRequestState();

  if (!pendingTransaction || pendingTransaction.txType !== 'token_transfer') {
    return null;
  }

  return (
    <Stack
      border="4px solid"
      borderColor="accent.border-default"
      borderRadius="12px"
      mb="space.05"
      px="space.04"
      py="space.06"
      gap="space.05"
    >
      <Title>Transfer details</Title>
      <Stack gap="base">
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
