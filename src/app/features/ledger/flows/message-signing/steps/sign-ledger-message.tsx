import { useContext } from 'react';

import { logger } from '@shared/logger';

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

  // return (
  //   <ApproveLedgerOperationLayout
  //     description="Sign message on your Ledger"
  //     details={[['Message', message]]}
  //     status={hasApprovedOperation ? 'approved' : 'awaiting-approval'}
  //   />
  // );

  return 'test page';
}
