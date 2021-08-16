import { POPUP_CENTER_HEIGHT, POPUP_CENTER_WIDTH } from '@shared/constants';

interface PopupOptions {
  url?: string;
  title?: string;
  w?: number;
  h?: number;
  skipPopupFallback?: boolean;
}
export function popupCenter(options: PopupOptions): Promise<any> {
  const { url, w = POPUP_CENTER_WIDTH, h = POPUP_CENTER_HEIGHT } = options;

  return new Promise(resolve => {
    // @see https://developer.chrome.com/docs/extensions/reference/windows/#method-getCurrent
    chrome.windows.getCurrent(async win => {
      // these units take into account the distance from
      // the farthest left/top sides of all displays
      const dualScreenLeft = win.left ?? 0;
      const dualScreenTop = win.top ?? 0;

      // dimensions of the window that originated the action
      const width = win.width ?? 0;
      const height = win.height ?? 0;

      const left = Math.floor(width / 2 - w / 2 + dualScreenLeft);
      const top = Math.floor(height / 2 - h / 2 + dualScreenTop);

      const popup = await chrome.windows.create({
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
