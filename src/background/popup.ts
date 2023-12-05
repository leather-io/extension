import { pxStringToNumber } from '@shared/utils/px-string-to-number';

// FIXME import from '@leather-wallet/tokens'
// import { tokens } from '../../theme/tokens';
/**
 * importing from tokens gives TS error about 
 * 
 * You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
|     value: { fontFamily: firaCode, fontSize: '0.6rem', lineHeight: '1rem' },
|   },
> } as const;
 */

const tokens = {
  sizes: {
    popupWidth: { value: '390px' },
    popupHeight: { value: '756px' },
  },
};

interface PopupOptions {
  url?: string;
  title?: string;
  skipPopupFallback?: boolean;
}

export function popup(options: PopupOptions): Promise<any> {
  // TODO 4370 - ask about this
  // if APP already open in full screen the window opens in a full screen and looks weird
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
