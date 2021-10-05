import { DecodedAuthRequest } from '@common/dev/types';
import {
  AuthenticationResponseMessage,
  ExternalMethods,
  MESSAGE_SOURCE,
} from '@common/message-types';
import { deleteTabForRequest, getTab, StorageKey } from '@common/storage';
import { isValidUrl } from '@common/validation/validate-url';

interface FinalizeAuthParams {
  decodedAuthRequest: DecodedAuthRequest;
  authResponse: string;
  authRequest: string;
}
/**
 * Call this function at the end of onboarding.
 *
 * We fetch the ID of the tab that originated this request from a data store.
 * Then, we send a message back to that tab, which is handled by the content script
 * of the extension.
 *
 */
export const finalizeAuthResponse = ({
  decodedAuthRequest,
  authRequest,
  authResponse,
}: FinalizeAuthParams) => {
  const dangerousUri = decodedAuthRequest.redirect_uri;
  if (!isValidUrl(dangerousUri)) {
    throw new Error('Cannot proceed with malicious url');
  }
  try {
    const tabId = getTab(StorageKey.authenticationRequests, authRequest);
    const responseMessage: AuthenticationResponseMessage = {
      source: MESSAGE_SOURCE,
      payload: {
        authenticationRequest: authRequest,
        authenticationResponse: authResponse,
      },
      method: ExternalMethods.authenticationResponse,
    };
    chrome.tabs.sendMessage(tabId, responseMessage);
    deleteTabForRequest(StorageKey.authenticationRequests, authRequest);
    window.close();
  } catch (error) {
    console.debug('Failed to get Tab ID for authentication request:', authRequest);
    throw new Error(
      'Your transaction was broadcasted, but we lost communication with the app you started with.'
    );
  }
};
