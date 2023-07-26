import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';
import { RouteUrls } from '@shared/route-urls';

import { IncreaseBtcFeeForm } from './components/increase-btc-fee-form';
import { IncreaseFeeDrawer } from './increase-fee-drawer';

function useIncreaseBtcFeeDrawerState() {
  const location = useLocation();
  return {
    tx: get(location.state, 'btcTx') as BitcoinTx,
  };
}

export function IncreaseBtcFeeDrawer() {
  const { tx } = useIncreaseBtcFeeDrawerState();
  const navigate = useNavigate();
  const location = useLocation();

  const onClose = () => {
    navigate(RouteUrls.Home);
  };

  return (
    tx && (
      <IncreaseFeeDrawer
        feeForm={<IncreaseBtcFeeForm btcTx={tx} />}
        onClose={onClose}
        isShowing={location.pathname === RouteUrls.IncreaseBtcFee}
      />
    )
  );
}
