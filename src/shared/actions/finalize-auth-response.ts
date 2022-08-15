import { DecodedAuthRequest } from '@shared/models/decoded-auth-request';
import {
  AuthenticationResponseMessage,
  ExternalMethods,
  MESSAGE_SOURCE,
} from '@shared/message-types';
import { isValidUrl } from '@shared/utils/validate-url';
import { analytics } from '@shared/utils/analytics';

interface FormatAuthResponseArgs {
  request: string;
  response: string;
}
export function formatAuthResponse({
  request,
  response,
}: FormatAuthResponseArgs): AuthenticationResponseMessage {
  return {
    source: MESSAGE_SOURCE,
    payload: {
      authenticationRequest: request,
      authenticationResponse: response,
    },
    method: ExternalMethods.authenticationResponse,
  };
}

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
    void analytics.track('auth_response_with_illegal_redirect_uri');
    throw new Error('Cannot redirect to a different domain than the one requesting');
  }

  const responseMessage = formatAuthResponse({ request: authRequest, response: authResponse });
  chrome.tabs.sendMessage(tabId, responseMessage);
  window.close();
}
