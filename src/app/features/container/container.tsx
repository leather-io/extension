import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router-dom';

import { useInitalizeAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useOnSignOut } from '@app/routes/hooks/use-on-sign-out';
import { useOnWalletLock } from '@app/routes/hooks/use-on-wallet-lock';
import { useHasStateRehydrated } from '@app/store';
import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { SettingsDropdown } from '../settings-dropdown/settings-dropdown';
import { SwitchAccountDrawer } from '../switch-account-drawer/switch-account-drawer';
import { ContainerLayout } from './container.layout';

export function Container({ setLocation }: { setLocation: (location: any) => void }) {
  const [routeHeader] = useRouteHeaderState();
  // const { pathname, state } = useLocation();
  const location = useLocation();
  const pathname = location.pathname;
  const analytics = useAnalytics();
  const hasStateRehydrated = useHasStateRehydrated();

  useOnWalletLock(() => window.close());
  useOnSignOut(() => window.close());

  useRestoreFormState();

  useInitalizeAnalytics();

  useEffect(() => void analytics.page('view', `${pathname}`), [analytics, pathname]);

  useEffect(() => setLocation(location), [location, setLocation]);
  if (!hasStateRehydrated) return <LoadingSpinner />;
  // console.info('location state', location);
  // if (location) {
  // }

  return (
    <>
      <SwitchAccountDrawer />
      <SettingsDropdown />
      <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px' } }} />
      <ContainerLayout header={routeHeader}>
        <Outlet />
      </ContainerLayout>
    </>
  );
}
