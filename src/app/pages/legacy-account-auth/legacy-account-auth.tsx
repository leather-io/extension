import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { useCancelAuthRequest } from '@app/common/authentication/use-cancel-auth-request';
import { useFinishAuthRequest } from '@app/common/authentication/use-finish-auth-request';
import { useAppDetails } from '@app/common/hooks/auth/use-app-details';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { appEvents } from '@app/common/publish-subscribe';
import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { useWalletType } from '@app/common/use-wallet-type';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { CurrentAccountDisplayer } from '@app/features/current-account/current-account-displayer';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useCurrentAccountIndex } from '@app/store/accounts/account';

import { ConnectAccountLayout } from '../../components/connect-account/connect-account.layout';

function listenForJwtSigningComplete() {
  return new Promise(resolve =>
    appEvents.subscribe('ledgerJwtMessageSigningComplete', () => resolve(true))
  );
}

export function LegacyAccountAuth() {
  const { url } = useAppDetails();
  const accountIndex = useCurrentAccountIndex();
  const finishSignIn = useFinishAuthRequest();
  const { toggleSwitchAccount } = useSwitchAccountSheet();
  const { whenWallet } = useWalletType();
  const navigate = useNavigate();
  const location = useLocation();

  useOnOriginTabClose(() => closeWindow());

  const cancelAuthentication = useCancelAuthRequest();

  const handleUnmount = async () => cancelAuthentication();
  useOnMount(() => window.addEventListener('beforeunload', handleUnmount));

  async function signIntoAccount(index: number) {
    await whenWallet({
      async software() {
        await finishSignIn(index);
      },
      async ledger() {
        navigate(RouteUrls.ConnectLedger, { state: { index, fromLocation: location } });
        await listenForJwtSigningComplete();
      },
    })();
  }

  if (!url) throw new Error('No app details found');

  return (
    <>
      <ConnectAccountLayout
        requester={url.origin}
        onUserApprovesGetAddresses={async () => signIntoAccount(accountIndex)}
        // Here we should refocus the tab that initiated the request, however
        // because the old auth code doesn't have the tab id and should be
        // eventually removed, we just open in a new tab
        onClickRequestedByLink={() => openInNewTab(url.origin)}
        switchAccount={<CurrentAccountDisplayer onSelectAccount={toggleSwitchAccount} />}
      />
      <Outlet />
    </>
  );
}
