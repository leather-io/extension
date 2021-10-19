import React from 'react';

import { hexToHumanReadable } from '@common/utils';
import { RowItem } from '@pages/transaction-signing/components/row-item';
import { useTransactionRequestState } from '@store/transactions/requests.hooks';

export const AttachmentRow: React.FC = () => {
  const pendingTransaction = useTransactionRequestState();
  return pendingTransaction?.attachment ? (
    <RowItem name="Attachment" value={hexToHumanReadable(pendingTransaction.attachment)} />
  ) : null;
};
