import { createContext, useContext } from 'react';
import { Outlet, Route, useNavigate } from 'react-router-dom';

import { delay } from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import {
  LeatherIntroDialog,
  LeatherIntroDialogPart1,
  LeatherIntroDialogPart2,
} from './leather-intro-steps';

export const leatherIntroDialogRoutes = (
  <Route element={<LeatherIntroDialogContainer />}>
    <Route path="we-have-a-new-name" element={<LeatherIntroDialogPart1 />} />
    <Route path="introducing-leather" element={<LeatherIntroDialogPart2 />} />
  </Route>
);

interface IntroContextProps {
  onRevealNewName(): void;
  onAcceptTerms(): void;
  onRejectAndUninstall(): void;
}
const introContext = createContext<IntroContextProps | null>(null);

const { Provider: LeatherIntroDialogProvider } = introContext;

export function useLeatherIntroDialogContext() {
  const context = useContext(introContext);
  if (!context) throw new Error('useLeatherIntroDialogContext must be used within a Provider');
  return context;
}

function LeatherIntroDialogContainer() {
  const navigate = useNavigate();
  async function onRevealNewName() {
    void analytics.track('new_brand_reveal_name');
    await delay(4000);
    navigate('./introducing-leather', { replace: true });
  }

  async function onAcceptTerms() {
    void analytics.track('new_brand_accept_terms');
    navigate('../', { replace: true });
  }

  function onRejectAndUninstall() {
    void analytics.track('new_brand_reject_terms');
    openInNewTab('https://leather.gitbook.io/guides/troubleshooting/uninstall-wallet');
  }

  return (
    <LeatherIntroDialogProvider value={{ onRevealNewName, onAcceptTerms, onRejectAndUninstall }}>
      <LeatherIntroDialog>
        <Outlet />
      </LeatherIntroDialog>
    </LeatherIntroDialogProvider>
  );
}
