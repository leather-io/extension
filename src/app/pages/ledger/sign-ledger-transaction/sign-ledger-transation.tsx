import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { SignLedgerTransactionLayout } from './sign-ledger-transaction.layout';

export const SignLedgerTransaction = () => {
  const navigate = useNavigate();

  return (
    <SignLedgerTransactionLayout onCancelSignTransaction={() => navigate(RouteUrls.Transaction)} />
  );
};
