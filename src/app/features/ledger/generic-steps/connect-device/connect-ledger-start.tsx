import { useLocation, useNavigate } from 'react-router-dom';

import { Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { doesBrowserSupportWebUsbApi, whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';

import { immediatelyAttemptLedgerConnection } from '../../hooks/use-when-reattempt-ledger-connection';
import { ConnectLedger } from './connect-ledger';

export function ConnectLedgerStart() {
  const navigate = useNavigate();
  const location = useLocation();

  const pageModeRoutingAction = (url: string) =>
    whenPageMode({
      full() {
        navigate(url, {
          replace: true,
          state: { [immediatelyAttemptLedgerConnection]: true, fromLocation: location },
        });
      },
      popup() {
        void openIndexPageInNewTab(url);
        closeWindow();
      },
    });

  function connectChain(chain: string) {
    const supportsWebUsbAction = pageModeRoutingAction(
      RouteUrls.Onboarding + `/${chain}/` + RouteUrls.ConnectLedger
    );
    const doesNotSupportWebUsbAction = pageModeRoutingAction(
      RouteUrls.Onboarding + '/' + RouteUrls.LedgerUnsupportedBrowser
    );

    doesBrowserSupportWebUsbApi() ? supportsWebUsbAction() : doesNotSupportWebUsbAction();
  }

  return (
    <Sheet isShowing header={<SheetHeader />} onClose={() => navigate('../')}>
      <ConnectLedger
        connectBitcoin={() => connectChain('bitcoin')}
        connectStacks={() => connectChain('stacks')}
        showInstructions
      />
    </Sheet>
  );
}
