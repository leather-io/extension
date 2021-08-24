import React from 'react';

import { useTransactionRequest } from '@store/transactions/requests.hooks';
import { hexToHumanReadable } from '@common/utils';
import { RowItem } from './row-item';

export const AttachmentRow: React.FC = () => {
  const pendingTransaction = useTransactionRequest();
  return pendingTransaction?.attachment ? (
    <RowItem name="Attachment" value={hexToHumanReadable(pendingTransaction.attachment)} />
  ) : null;
};
