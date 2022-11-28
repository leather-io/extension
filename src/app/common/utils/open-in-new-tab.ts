import { RouteUrls } from '@shared/route-urls';
import { isValidUrl } from '@shared/utils/validate-url';

export function openInNewTab(url: string) {
  if (!isValidUrl(url)) return;
  // Only place window.open may be called
  // eslint-disable-next-line no-restricted-properties
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
}

export function openIndexPageInNewTab(path: RouteUrls | string, searchParams?: string) {
  const paramsString = searchParams ? searchParams : '';
  return chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html#${path}` + paramsString),
  });
}
