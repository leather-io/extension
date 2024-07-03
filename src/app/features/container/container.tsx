import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';

import { useInitalizeAnalytics } from '@app/common/app-analytics';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { InAppMessages } from '@app/features/hiro-messages/in-app-messages';
import { useOnSignOut } from '@app/routes/hooks/use-on-sign-out';
import { useOnWalletLock } from '@app/routes/hooks/use-on-wallet-lock';
import { useHasStateRehydrated } from '@app/store';

import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { OnboardingLayout } from './containers/onboarding.layout';

interface ContainerProps {
  Layout: React.JSX.Element | React.JSX.Element[];
}

export function Container({ Layout }: ContainerProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const { pathname: locationPathname } = useLocation();
  const pathname = locationPathname as RouteUrls;

  const hasStateRehydrated = useHasStateRehydrated();

  useOnWalletLock(() => closeWindow());
  useOnSignOut(() => closeWindow());
  useRestoreFormState();
  useInitalizeAnalytics();

  useEffect(() => void analytics.page('view', `${pathname}`), [pathname]);

  if (!hasStateRehydrated) return <LoadingSpinner />;

  return (
    <>
      {isShowingSwitchAccount && (
        <SwitchAccountDialog
          isShowing={isShowingSwitchAccount}
          onClose={() => setIsShowingSwitchAccount(false)}
        />
      )}

      <InAppMessages />
      {/* Pete try and pass ContainerLayout as prop to container from app-routes 
      
      big problem is how subpages can manage their own headers without having to store it in state. 
      Do I need to wrap each page in <containerLayout so it can then define its own header???
      */}

       >PETE  this actually doesn't work and is showing the same header for everything :?() 
> need to understand how to pass this in properly
        > need to sar */}
      <Layout>
        <Outlet context={{ isShowingSwitchAccount, setIsShowingSwitchAccount }} />
      </Layout>
    </>
  );
}
