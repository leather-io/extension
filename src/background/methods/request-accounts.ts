import { popupCenter } from '@background/popup-center';
import { SupportedRpcMessages } from '@shared/message-types';
import { RouteUrls } from '@shared/route-urls';

export function requestAccounts(tabId: number, origin: string, message: SupportedRpcMessages) {
  const params = new URLSearchParams();

  params.set('tabId', tabId.toString());
  params.set('id', message.id);
  params.set('origin', origin.toString());

  popupCenter({
    url: `/popup-center.html#${RouteUrls.AccountRequest}?${params.toString()}`,
  });
}
