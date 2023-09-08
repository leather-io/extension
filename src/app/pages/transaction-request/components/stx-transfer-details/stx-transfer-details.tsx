import { Stack } from 'leather-styles/jsx';
import { divider } from 'leather-styles/patterns';
import { token } from 'leather-styles/tokens';

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
      borderColor={token('colors.accent.border-default')}
      borderRadius="12px"
      mb="space.05"
      px="base-loose"
      py="space.06"
      gap="space.05"
    >
      <Title as="h2" fontWeight="500">
        Transfer details
      </Title>
      <Stack
        className={divider({
          orientation: 'horizontal',
          thickness: '1px',
          color: token('colors.accent.border-default'),
        })}
        gap="space.04"
      >
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
