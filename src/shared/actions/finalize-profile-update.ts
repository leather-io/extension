import {
  ExternalMethods,
  MESSAGE_SOURCE,
  ProfileUpdaterResponseMessage,
} from '@shared/message-types';
import { PublicProfile } from '@shared/profiles/types';

interface FormatProfileUpdaterResponseArgs {
  request: string;
  response: PublicProfile | string;
}
export function formatProfileUpdaterResponse({
  request,
  response,
}: FormatProfileUpdaterResponseArgs): ProfileUpdaterResponseMessage {
  return {
    source: MESSAGE_SOURCE,
    method: ExternalMethods.profileUpdaterResponse,
    payload: { profileUpdaterRequest: request, profileUpdaterResponse: response },
  };
}

interface FinalizeProfileUpdateArgs {
  requestPayload: string;
  tabId: number;
  data: PublicProfile | string;
}
export function finalizeProfileUpdate({ requestPayload, data, tabId }: FinalizeProfileUpdateArgs) {
  const responseMessage = formatProfileUpdaterResponse({ request: requestPayload, response: data });
  chrome.tabs.sendMessage(tabId, responseMessage);
  window.close();
}
