import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Flex, Spinner, Stack } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { Caption } from '@app/components/typography';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';

import { IncreaseFeeForm } from './components/increase-fee-form';

export function IncreaseFeeDrawer() {
  const [rawTxId, setRawTxId] = useRawTxIdState();
  const { isLoading, setIsIdle } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const txIdFromParams = searchParams.get('txId');

  useEffect(() => {
    if (!rawTxId && txIdFromParams) {
      setRawTxId(txIdFromParams);
    }
    if (isLoading && !rawTxId) {
      setIsIdle();
    }
  }, [isLoading, rawTxId, setIsIdle, setRawTxId, txIdFromParams]);

  const onClose = () => {
    setRawTxId(null);
    navigate(RouteUrls.Home);
  };

  return rawTxId ? (
    <>
      <BaseDrawer
        isShowing={location.pathname === RouteUrls.IncreaseFee}
        onClose={onClose}
        title="Increase transaction fee"
      >
        <Stack px="loose" spacing="loose" pb="extra-loose">
          <Suspense
            fallback={
              <Flex alignItems="center" justifyContent="center" p="extra-loose">
                <Spinner />
              </Flex>
            }
          >
            <Caption>
              If your transaction has been pending for a long time, its fee might not be high enough
              to be included in a block. Increase the fee and try again.
            </Caption>
            <IncreaseFeeForm />
          </Suspense>
        </Stack>
      </BaseDrawer>
      <Outlet />
    </>
  ) : null;
}
