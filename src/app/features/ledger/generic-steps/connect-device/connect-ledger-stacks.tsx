import { useLocation, useNavigate } from 'react-router-dom';

import { Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';

import { immediatelyAttemptLedgerConnection } from '../../hooks/use-when-reattempt-ledger-connection';
import { ConnectLedger } from './connect-ledger';

export function ConnectLedgerStacks() {
  const navigate = useNavigate();
  const location = useLocation();

  function onConnectStacks() {
    return whenPageMode({
      full() {
        navigate('stacks/connect-your-ledger', {
          replace: true,
          state: {
            [immediatelyAttemptLedgerConnection]: true,
            backgroundLocation: { pathname: RouteUrls.Home },
            fromLocation: location,
          },
        });
      },
      popup() {
        void openIndexPageInNewTab(RouteUrls.Home);
        closeWindow();
      },
    });
  }

  return (
    <Sheet isShowing header={<SheetHeader />} onClose={() => navigate('../')}>
      <ConnectLedger connectStacks={onConnectStacks()} showInstructions />
    </Sheet>
  );
}
