import { DecodedAuthRequest } from '@app/common/dev/types';
import {
  AuthenticationResponseMessage,
  ExternalMethods,
  MESSAGE_SOURCE,
} from '@shared/message-types';
import { isValidUrl } from '@app/common/validation/validate-url';
import { logger } from '@shared/logger';

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
    throw new Error('Cannot redirect to a different domain than the one requesting');
  }

  try {
    const responseMessage: AuthenticationResponseMessage = {
      source: MESSAGE_SOURCE,
      payload: {
        authenticationRequest: authRequest,
        authenticationResponse: authResponse,
      },
      method: ExternalMethods.authenticationResponse,
    };
    chrome.tabs.sendMessage(tabId, responseMessage);
    window.close();
  } catch (error) {
    logger.debug('Failed to get Tab ID for authentication request:', authRequest);
    throw new Error(
      'Your transaction was broadcasted, but we lost communication with the app you started with.'
    );
  }
}
