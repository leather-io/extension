import { isValidUrl } from '@app/common/validation/validate-url';

export const openInNewTab = (url: string) => {
  if (!isValidUrl(url)) return;
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};
