import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { useTimeout } from '@app/common/hooks/use-timeout';

import { ConnectLedgerSuccessLayout } from './connect-ledger-success.layout';

export const ConnectLedgerSuccess = () => {
  const navigate = useNavigate();

  useTimeout(() => () => navigate(RouteUrls.Home), 2500);

  return <ConnectLedgerSuccessLayout onCloseModal={() => navigate(RouteUrls.Home)} />;
};
