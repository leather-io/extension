import { DecodedAuthRequest } from '@shared/models/decoded-auth-request';
import { closeWindow } from '@shared/utils';
import { analytics } from '@shared/utils/analytics';
import { isValidUrl } from '@shared/utils/validate-url';

import { formatAuthResponse } from './finalize-auth-reaponse-format';

interface FinalizeAuthParams {
  decodedAuthRequest: DecodedAuthRequest;
  authResponse: string;
  authRequest: string;
  requestingOrigin: string;
  tabId: number;
}

/**
 * Call this function at the end of onboarding.
 *
 * We fetch the ID of the tab that originated this request from a data store.
 * Then, we send a message back to that tab, which is handled by the content script
 * of the extension.
 *
 */
export function finalizeAuthResponse({
  decodedAuthRequest,
  authRequest,
  authResponse,
  requestingOrigin,
  tabId,
}: FinalizeAuthParams) {
  const dangerousUri = decodedAuthRequest.redirect_uri;
  if (!isValidUrl(dangerousUri)) {
    throw new Error('Cannot proceed with malicious url');
  }
  const redirectUri = new URL(dangerousUri);
  const origin = new URL(requestingOrigin);

  if (redirectUri.hostname !== origin.hostname) {
    void analytics?.track('auth_response_with_illegal_redirect_uri');
    throw new Error('Cannot redirect to a different domain than the one requesting');
  }

  const responseMessage = formatAuthResponse({ request: authRequest, response: authResponse });
  chrome.tabs.sendMessage(tabId, responseMessage);
  closeWindow();
}
