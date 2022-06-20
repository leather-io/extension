import { isValidUrl } from '@app/common/validation/validate-url';
import { RouteUrls } from '@shared/route-urls';

export function openInNewTab(url: string) {
  if (!isValidUrl(url)) return;
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
}

export function openIndexPageInNewTab(path: RouteUrls | string) {
  return chrome.tabs.create({ url: chrome.runtime.getURL('index.html#' + path) });
}
