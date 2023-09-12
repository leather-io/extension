import { hexToHumanReadable } from '@app/common/utils';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

import { Row } from './row';

export function AttachmentRow(): React.JSX.Element | null {
  const pendingTransaction = useTransactionRequestState();
  return pendingTransaction?.attachment ? (
    <Row name="Attachment" value={hexToHumanReadable(pendingTransaction.attachment)} />
  ) : null;
}
