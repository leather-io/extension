const popupCenterWidth = 442;
const popupCenterHeight = 646;

interface PopupOptions {
  url?: string;
  title?: string;
  w?: number;
  h?: number;
  skipPopupFallback?: boolean;
}
export function popupCenter(options: PopupOptions) {
  const { url, w = popupCenterWidth, h = popupCenterHeight } = options;

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

    await chrome.windows.create({
      url,
      width: w,
      height: h,
      top,
      left,
      focused: true,
      type: 'popup',
    });
  });
}
