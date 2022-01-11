import React from 'react';

import { hexToHumanReadable } from '@common/utils';
import { useTransactionRequestState } from '@store/transactions/requests.hooks';

import { Row } from './row';

export function AttachmentRow(): JSX.Element | null {
  const pendingTransaction = useTransactionRequestState();
  return pendingTransaction?.attachment ? (
    <Row name="Attachment" value={hexToHumanReadable(pendingTransaction.attachment)} />
  ) : null;
}
