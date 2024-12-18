import { Outlet, useNavigate } from 'react-router-dom';

import { Sheet, SheetHeader } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';

import { LedgerRequestKeysContext, LedgerRequestKeysProvider } from './ledger-request-keys.context';

interface RequestKeysFlowProps {
  context: LedgerRequestKeysContext;
  isActionCancellableByUser: boolean;
}
export function RequestKeysFlow({ context, isActionCancellableByUser }: RequestKeysFlowProps) {
  useScrollLock(true);
  const navigate = useNavigate();

  return (
    <LedgerRequestKeysProvider value={context}>
      <Sheet
        isShowing
        header={<SheetHeader />}
        onClose={isActionCancellableByUser ? () => navigate(RouteUrls.Home) : undefined}
      >
        <Outlet />
      </Sheet>
    </LedgerRequestKeysProvider>
  );
}
