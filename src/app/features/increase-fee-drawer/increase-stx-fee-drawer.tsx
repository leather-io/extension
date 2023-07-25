import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';

import { IncreaseStxFeeForm } from './components/increase-stx-fee-form';
import { IncreaseFeeDrawer } from './increase-fee-drawer';

export function IncreaseStxFeeDrawer() {
  const [rawTxId, setRawTxId] = useRawTxIdState();
  const { isLoading, setIsIdle } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const txIdFromParams = searchParams.get('txId');

  const onClose = () => {
    setRawTxId(null);
    navigate(RouteUrls.Home);
  };

  useEffect(() => {
    if (!rawTxId && txIdFromParams) {
      setRawTxId(txIdFromParams);
    }
    if (isLoading && !rawTxId) {
      setIsIdle();
    }
  }, [isLoading, rawTxId, setIsIdle, setRawTxId, txIdFromParams]);

  return (
    <IncreaseFeeDrawer
      feeForm={<IncreaseStxFeeForm />}
      onClose={onClose}
      isShowing={location.pathname === RouteUrls.IncreaseStxFee}
    />
  );
}
