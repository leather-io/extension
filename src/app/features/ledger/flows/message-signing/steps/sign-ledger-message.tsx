import { useContext } from 'react';

import { cvToString } from '@stacks/transactions';

import { logger } from '@shared/logger';
import { whenSignedMessageOfType } from '@shared/signature/signature-types';

import { ApproveLedgerOperationLayout } from '../../../generic-steps';
import { useHasApprovedOperation } from '../../../hooks/use-has-approved-transaction';
import { ledgerMsgSigningContext } from '../ledger-sign-msg.context';

export function SignLedgerMessage() {
  const { message } = useContext(ledgerMsgSigningContext);
  const hasApprovedOperation = useHasApprovedOperation();

  if (!message) {
    logger.error(`${SignLedgerMessage.name} must not render without a "message" defined`);
    return null;
  }

  return whenSignedMessageOfType(message)({
    utf8: msg => (
      <ApproveLedgerOperationLayout
        description="Sign message on your Ledger"
        details={[['Message', msg]]}
        status={hasApprovedOperation ? 'approved' : 'awaiting-approval'}
      />
    ),
    structured: domain => (
      <ApproveLedgerOperationLayout
        description="Sign structured data on your Ledger"
        details={[
          ['Chain ID', cvToString(domain.data['chain-id'])],
          ['Name', cvToString(domain.data.name)],
          ['Version', cvToString(domain.data.version)],
        ]}
        status={hasApprovedOperation ? 'approved' : 'awaiting-approval'}
      />
    ),
  }) as JSX.Element;
}
