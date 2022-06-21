import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Flex, Spinner, Stack } from '@stacks/ui';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';
import { Caption } from '@app/components/typography';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';
import { RouteUrls } from '@shared/route-urls';

import { IncreaseFeeForm } from './components/increase-fee-form';

export function IncreaseFeeDrawer(): JSX.Element {
  const [rawTxId, setRawTxId] = useRawTxIdState();
  const { isLoading, setIsIdle } = useLoading(LoadingKeys.INCREASE_FEE_DRAWER);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading && !rawTxId) {
      setIsIdle();
    }
  }, [isLoading, rawTxId, setIsIdle]);

  const onClose = () => {
    setRawTxId(null);
    navigate(RouteUrls.Home);
  };

  return (
    <>
      <ControlledDrawer
        isShowing={location.pathname === RouteUrls.IncreaseFee}
        onClose={onClose}
        title="Increase transaction fee"
      >
        <Stack px="loose" spacing="loose" pb="extra-loose">
          {rawTxId ? (
            <Suspense
              fallback={
                <Flex alignItems="center" justifyContent="center" p="extra-loose">
                  <Spinner />
                </Flex>
              }
            >
              <Caption>
                If your transaction has been pending for a long time, its fee might not be high
                enough to be included in a block. Increase the fee and try again.
              </Caption>
              <IncreaseFeeForm />
            </Suspense>
          ) : null}
        </Stack>
      </ControlledDrawer>
      <Outlet />
    </>
  );
}
