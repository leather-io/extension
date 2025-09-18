import { isDefined } from '@leather.io/utils';

const sessionTrackingPort = 'leather-session';

type SessionFrame = 'fullscreen' | 'action-popup' | 'window-popup';

export function initiateLeatherSessionTrackingPort() {
  chrome.runtime.connect({ name: sessionTrackingPort });
}

function createOriginUrlCheckFn(pathName: string) {
  return (url: string) => url === '/' + pathName;
}
const isFullPage = createOriginUrlCheckFn('index.html');
const isActionPopup = createOriginUrlCheckFn('action-popup.html');
const isWindowPopup = createOriginUrlCheckFn('popup.html');

function inferFrameType(sender: chrome.runtime.MessageSender) {
  if (!sender || !sender.url) return null;
  const url = new URL(sender.url);
  if (isFullPage(url.pathname)) return 'fullscreen';
  if (isActionPopup(url.pathname)) return 'action-popup';
  if (isWindowPopup(url.pathname)) return 'window-popup';
  return null;
}

// Action popup has no tabId, we use 0
function getOriginTabIdWithActionPopupFallback(sender: chrome.runtime.MessageSender) {
  return sender.tab?.id ?? 0;
}

const tabIdSessionStartMap = new Map<number, number>();

interface ListenForSessionDurationPortArgs {
  onSessionEnd(args: { sessionFrame: SessionFrame; durationSeconds: number }): void;
}
export function listenForSessionDurationPort({ onSessionEnd }: ListenForSessionDurationPortArgs) {
  chrome.runtime.onConnect.addListener(port => {
    const sender = port.sender;
    if (!sender || !sender.origin) return;

    if (port.name !== sessionTrackingPort && !chrome.runtime.getURL('').startsWith(sender.origin))
      return;

    tabIdSessionStartMap.set(getOriginTabIdWithActionPopupFallback(sender), new Date().valueOf());

    port.onDisconnect.addListener(() => {
      const id = getOriginTabIdWithActionPopupFallback(sender);

      const startTime = tabIdSessionStartMap.get(id);
      const frameType = inferFrameType(sender);

      if (!isDefined(startTime) || !frameType) return;

      function capDurationAt10Minutes(duration: number) {
        return Math.min(duration, 600);
      }

      tabIdSessionStartMap.delete(id);
      onSessionEnd({
        sessionFrame: frameType,
        // Frames could last days at a time, and users are of unlikely to be
        // actively using leather for such long durations. This cap is a measure
        // to prevent unrealistically high session durations
        durationSeconds: capDurationAt10Minutes((new Date().valueOf() - startTime) / 1000),
      });
    });
  });
}
