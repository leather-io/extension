import { pxStringToNumber } from '@leather-wallet/utils';

interface PopupOptions {
  url?: string;
  title?: string;
  skipPopupFallback?: boolean;
}
// FIXME import popupTokens from '@leather-wallet/tokens' when bundling working
// https://github.com/leather-wallet/mono/pull/76
const popupTokens = {
  popupWidth: { value: '390px' },
  popupHeight: { value: '756px' },
};

export function popup(options: PopupOptions): Promise<any> {
  const { url } = options;

  const popupWidth = pxStringToNumber(popupTokens.popupWidth.value);
  const popupHeight = pxStringToNumber(popupTokens.popupHeight.value);

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
