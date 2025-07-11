import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import { useAtom, useAtomValue } from 'jotai';

import { isDefined } from '@leather.io/utils';

import { useLocationState } from '@app/common/hooks/use-location-state';

import { secretKeyState, seedInputErrorState } from './onboarding';

export function useSeedInputErrorState() {
  return useAtom(seedInputErrorState);
}

export function useSecretKeyState() {
  return useAtomValue(secretKeyState);
}

export function useOnFinishedOnboarding(fn: () => void) {
  const hasCalledFn = useRef(false);
  const fromOnboarding = useLocationState('fromOnboarding');
  const navigate = useNavigate();

  useEffect(() => {
    if (fromOnboarding && !hasCalledFn.current) {
      hasCalledFn.current = true;
      fn();
      navigate('/', { replace: true, state: { fromOnboarding: false } });
    }
  }, [fn, fromOnboarding, navigate]);
}

const leatherDomains = ['leather.io', 'app.leather.io', 'app.staging.leather.io'];

export async function refreshLeatherTabs() {
  if (!chrome.tabs) return;
  const tabs = await chrome.tabs.query({});

  tabs
    .filter(tab => {
      if (!tab.url) return false;
      const hostname = new URL(tab.url).hostname;
      return leatherDomains.includes(hostname) && isDefined(tab.id);
    })
    .map(tab => ({ tabId: tab.id ?? 0 }))
    .forEach(({ tabId }) => chrome.tabs.reload(tabId, { bypassCache: true }));
}
