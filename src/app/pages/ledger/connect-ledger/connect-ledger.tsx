import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ConnectLedgerLayout } from './connect-ledger.layout';

export const ConnectLedger = () => {
  const [isLookingForLedger, setIsLookingForLedger] = useState(false);
  const navigate = useNavigate();

  const connectLedger = useCallback(() => {
    setIsLookingForLedger(true);
    // TODO: Replace with actual ledger integration
    setTimeout(() => {
      setIsLookingForLedger(false);
      navigate(RouteUrls.ConnectLedgerSuccess);
      // navigate(RouteUrls.ConnectLedgerError);
    }, 2000);
  }, [navigate]);

  return (
    <ConnectLedgerLayout
      isLookingForLedger={isLookingForLedger}
      onCancelConnectLedger={() => navigate(RouteUrls.Onboarding)}
      onConnectLedger={connectLedger}
    />
  );
};
