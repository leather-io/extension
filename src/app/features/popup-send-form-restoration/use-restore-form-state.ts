import { useNavigate } from 'react-router-dom';

import { getActiveTab } from '@shared/utils/get-active-tab';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { isPopupMode } from '@app/common/utils';

// Would rather use the `useAsync` hook to call this promise, however this is
// excuted later in the lifecycle of the app, which causes the homepage to
// render first.
let currentTabId = 0;
async function run() {
  const tab = await getActiveTab();
  // Tab can sometimes be undefined in mobile extension environments
  // https://trust-machines.sentry.io/issues/3999731741/?project=4504204000952320
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!tab) return;
  currentTabId = tab.id ?? 0;
}
void run();

export function useRestoreFormState() {
  const navigate = useNavigate();

  useOnMount(async () => {
    if (!isPopupMode() || !currentTabId || !chrome.storage.session) return;
    const key = 'form-state-' + currentTabId.toString();
    const state = await chrome.storage.session.get('form-state-' + currentTabId.toString());
    const persistedState = state[key];
    if (!persistedState || !persistedState.symbol) return;
    navigate('send/' + persistedState.symbol, { state: persistedState });
  });
}
