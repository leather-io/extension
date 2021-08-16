import {
  AuthenticationResponseMessage,
  ExternalMethods,
  MESSAGE_SOURCE,
} from '@shared/message-types';

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
