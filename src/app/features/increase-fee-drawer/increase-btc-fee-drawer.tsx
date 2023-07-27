import { useLocation, useNavigate } from 'react-router-dom';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';
import { RouteUrls } from '@shared/route-urls';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';

import { IncreaseBtcFeeForm } from './components/increase-btc-fee-form';
import { IncreaseFeeDrawer } from './increase-fee-drawer';

function useIncreaseBtcFeeDrawerState() {
  return {
    tx: useLocationStateWithCache('btcTx') as BitcoinTx,
  };
}

export function IncreaseBtcFeeDrawer() {
  const { tx } = useIncreaseBtcFeeDrawerState();
  const navigate = useNavigate();
  const location = useLocation();

  const onClose = () => {
    navigate(RouteUrls.Home);
  };

  if (!tx) return null;

  return (
    <IncreaseFeeDrawer
      feeForm={<IncreaseBtcFeeForm btcTx={tx} />}
      onClose={onClose}
      isShowing={location.pathname === RouteUrls.IncreaseBtcFee}
    />
  );
}
