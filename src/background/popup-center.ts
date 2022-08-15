import { POPUP_CENTER_HEIGHT, POPUP_CENTER_WIDTH } from '@shared/constants';
import type { Windows } from 'webextension-polyfill';

interface PopupOptions {
  url?: string;
  title?: string;
  w?: number;
  h?: number;
  skipPopupFallback?: boolean;
}
export function popupCenter(options: PopupOptions): Promise<Windows.Window> {
  const { url, w = POPUP_CENTER_WIDTH, h = POPUP_CENTER_HEIGHT } = options;

  return new Promise(resolve => {
    // @see https://developer.chrome.com/docs/extensions/reference/windows/#method-getCurrent
    chrome.windows.getCurrent(async win => {
      // these units take into account the distance from
      // the farthest left/top sides of all displays
      const dualScreenLeft = win.left || window.screenLeft;
      const dualScreenTop = win.top || window.screenTop;

      // dimensions of the window that originated the action
      const width = win.width || window.innerWidth;
      const height = win.height || window.innerHeight;

      const left = Math.floor(width / 2 - w / 2 + dualScreenLeft);
      const top = Math.floor(height / 2 - h / 2 + dualScreenTop);

      const popup = await browser.windows.create({
        url,
        width: w,
        height: h,
        top,
        left,
        focused: true,
        type: 'popup',
      });

      resolve(popup);
    });
  });
}
