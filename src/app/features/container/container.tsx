import { cloneElement, useEffect, useState } from 'react';
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

interface ContainerProps {
  layout: any;
}

export function Container({ layout }: ContainerProps) {
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

      {layout &&
        cloneElement(
          layout,
          { isShowingSwitchAccount, setIsShowingSwitchAccount }, // pass props here e.g. onGoBack?

          // > good progress but stuck here and on how to set title and onGoBack

          // TBC

          // maybe pass setOnGoBackLocation to outlet which updates state in this component?
          // then gets passed as a prop to the layout?
          <Outlet context={{ isShowingSwitchAccount, setIsShowingSwitchAccount }} />
        )}
    </>
  );
}
