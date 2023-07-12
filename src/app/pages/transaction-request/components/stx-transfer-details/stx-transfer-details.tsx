import { Stack, color } from '@stacks/ui';

import { Divider } from '@app/components/layout/divider';
import { Title } from '@app/components/typography';
import { AttachmentRow } from '@app/pages/transaction-request/components/attachment-row';
import { Row } from '@app/pages/transaction-request/components/row';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

export function StxTransferDetails(): React.JSX.Element | null {
  const pendingTransaction = useTransactionRequestState();

  if (!pendingTransaction || pendingTransaction.txType !== 'token_transfer') {
    return null;
  }

  return (
    <Stack
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      mb="loose"
      px="base-loose"
      py="extra-loose"
      spacing="loose"
    >
      <Title as="h2" fontWeight="500">
        Transfer details
      </Title>
      <Stack divider={<Divider />} spacing="base">
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
