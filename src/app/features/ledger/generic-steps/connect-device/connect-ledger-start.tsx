import { useNavigate } from 'react-router-dom';

import { Dialog } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { doesBrowserSupportWebUsbApi, whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { DialogHeader } from '@app/ui/layout/containers/headers/dialog-header';

import { immediatelyAttemptLedgerConnection } from '../../hooks/use-when-reattempt-ledger-connection';
import { ConnectLedger } from './connect-ledger';

export function ConnectLedgerStart() {
  const navigate = useNavigate();
  const pageModeRoutingAction = (url: string) =>
    whenPageMode({
      full() {
        navigate(url, { replace: true, state: { [immediatelyAttemptLedgerConnection]: true } });
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
    <Dialog isShowing header={<DialogHeader />} onClose={() => navigate('../')}>
      <ConnectLedger
        connectBitcoin={() => connectChain('bitcoin')}
        connectStacks={() => connectChain('stacks')}
        showInstructions
      />
    </Dialog>
  );
}
