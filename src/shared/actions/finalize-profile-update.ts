import {
  ExternalMethods,
  MESSAGE_SOURCE,
  ProfileUpdateResponseMessage,
} from '@shared/message-types';
import { Profile } from '@stacks/profile';

interface FormatProfileUpdateResponseArgs {
  request: string;
  response: Profile | string;
}
export function formatProfileUpdateResponse({
  request,
  response,
}: FormatProfileUpdateResponseArgs): ProfileUpdateResponseMessage {
  return {
    source: MESSAGE_SOURCE,
    method: ExternalMethods.profileUpdateResponse,
    payload: {
      profileUpdateRequest: request,
      profileUpdateResponse: response,
    },
  };
}

interface FinalizeProfileUpdateArgs {
  requestPayload: string;
  tabId: number;
  data: Profile | string;
}
export function finalizeProfileUpdate({ requestPayload, data, tabId }: FinalizeProfileUpdateArgs) {
  const responseMessage = formatProfileUpdateResponse({ request: requestPayload, response: data });
  chrome.tabs.sendMessage(tabId, responseMessage);
  window.close();
}
