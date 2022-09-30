import { ExternalMethods, MESSAGE_SOURCE, SignatureResponseMessage, UpdateProfileResponseMessage } from '@shared/message-types';
import { PublicProfile } from '@shared/profiles/types';
import { SignatureData } from '@stacks/connect';

interface FormatProfileUpdateResponseArgs {
  request: string;
  response: SignatureData | string;
}
export function formatProfileUpdateResponse({
  request,
  response,
}: FormatProfileUpdateResponseArgs): UpdateProfileResponseMessage {
  return {
    source: MESSAGE_SOURCE,
    method: ExternalMethods.updateProfileResponse,
    payload: { updateProfileRequest: request, updateProfileResponse: response },
  };
}

interface FinalizeUpdateProfileArgs {
  requestPayload: string;
  tabId: number;
  data: PublicProfile | string;
}
export function finalizeUpdateProfile({
  requestPayload,
  data,
  tabId,
}: FinalizeUpdateProfileArgs) {
  const responseMessage = formatProfileUpdateResponse({ request: requestPayload, response: data });
  chrome.tabs.sendMessage(tabId, responseMessage);
  window.close();
}
