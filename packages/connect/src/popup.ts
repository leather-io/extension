interface PopupOptions {
  url?: string;
  title?: string;
  w?: number;
  h?: number;
}

// Width 2px wider than in-page dialog.
// Ensures retina subpixel rounding
// does not leave slightly blurry underlap
const defaultWidth = 442;
const defaultHeight = 532;
const defaultTitle = 'Continue with Secret Key';

// https://developer.mozilla.org/en-US/docs/Web/API/Window/open
export const popupCenter = ({
  url,
  title = defaultTitle,
  w = defaultWidth,
  h = defaultHeight,
}: PopupOptions) => {
  const win = window;
  // Safari reports an incorrect browser height
  const isSafari = (win as any).safari !== undefined;

  const browserViewport = {
    width: win.innerWidth,
    height: win.innerHeight,
  };
  const browserToolbarHeight = win.outerHeight - win.innerHeight;
  const browserSidepanelWidth = win.outerWidth - win.innerWidth;

  // Such as fixed operating system UI
  const removeUnusableSpaceX = (coord: number) =>
    coord - (win.screen.width - win.screen.availWidth);
  const removeUnusableSpaceY = (coord: number) =>
    coord - (win.screen.height - win.screen.availHeight);

  const browserPosition = {
    x: removeUnusableSpaceX(win.screenX),
    y: removeUnusableSpaceY(win.screenY),
  };

  const left = browserPosition.x + browserSidepanelWidth + (browserViewport.width - w) / 2;
  const top =
    browserPosition.y +
    browserToolbarHeight +
    (browserViewport.height - h) / 2 +
    (isSafari ? 48 : 0);

  const options = {
    scrollbars: 'no',
    width: w,
    height: h,
    top,
    left,
  };
  const optionsString = Object.keys(options).map(key => {
    return `${key}=${options[key as keyof typeof options]}`;
  });
  const newWindow = window.open(url, title, optionsString.join(','));

  if (newWindow) {
    newWindow.focus();
    return newWindow;
  }

  // no popup options, just open the auth page
  return window.open(url);
};

interface ListenerParams<FinishedType> {
  popup: Window | null;
  messageParams: {
    [key: string]: any;
  };
  finished: (payload: FinishedType) => void | Promise<void>;
  authURL: URL;
}

export const setupListener = <T>({
  popup,
  messageParams,
  finished,
  authURL,
}: ListenerParams<T>) => {
  // Send a message to the authenticator popup at a consistent interval. This allows
  // the authenticator to 'respond'.
  const pingInterval = 100;
  const interval = setInterval(() => {
    if (popup) {
      try {
        popup.postMessage(messageParams, authURL.origin);
      } catch (error) {
        console.warn('[Blockstack] Unable to send ping to authentication service');
        clearInterval(interval);
      }
    }
  }, pingInterval);

  const receiveMessage = async (event: MessageEvent) => {
    if (event.data.source === 'blockstack-app') {
      const data = event.data as T;
      await finished(data);
      window.focus();
      window.removeEventListener('message', receiveMessageCallback);
      clearInterval(interval);
    }
  };

  const receiveMessageCallback = (event: MessageEvent) => {
    void receiveMessage(event);
  };

  window.addEventListener('message', receiveMessageCallback, false);
};
