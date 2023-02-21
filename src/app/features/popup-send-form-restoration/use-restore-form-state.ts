import { useNavigate } from 'react-router-dom';

import { InternalMethods } from '@shared/message-types';
import { getActiveTab } from '@shared/utils/get-active-tab';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { isPopupMode } from '@app/common/utils';

// Would rather use the `useAsync` hook to call this promise, however this is
// excuted later in the lifecycle of the app, which causes the homepage to
// render first.
let currentTabId = 0;
async function run() {
  const tab = await getActiveTab();
  currentTabId = tab.id ?? 0;
}
void run();

export function useRestoreFormState() {
  const navigate = useNavigate();

  useOnMount(() => {
    if (!isPopupMode() || !currentTabId) return;
    chrome.runtime.sendMessage(
      { method: InternalMethods.GetActiveFormState, payload: { tabId: currentTabId } },
      persistedState => {
        if (!persistedState || !persistedState.symbol) return;
        navigate('send/' + persistedState.symbol, { state: persistedState });
      }
    );
  });
}
