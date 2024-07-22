import { tokens } from '@leather.io/tokens';

import { pxStringToNumber } from '@shared/utils/px-string-to-number';

interface PopupOptions {
  url?: string;
  title?: string;
  skipPopupFallback?: boolean;
}

export function popup(options: PopupOptions): Promise<any> {
  const { url } = options;

  const popupWidth = pxStringToNumber(tokens.sizes.popupWidth.value);
  const popupHeight = pxStringToNumber(tokens.sizes.popupHeight.value);

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

      const left = Math.floor(width / 2 - popupWidth / 2 + dualScreenLeft);
      const top = Math.floor(height / 2 - popupHeight / 2 + dualScreenTop);

      const popup = await chrome.windows.create({
        url,
        width: popupWidth,
        height: popupHeight,
        top,
        left,
        focused: true,
        type: 'popup',
      });

      resolve(popup);
    });
  });
}
