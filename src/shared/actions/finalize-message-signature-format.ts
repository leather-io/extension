import { SignatureData } from '@stacks/connect-jwt';

import { ExternalMethods, MESSAGE_SOURCE, SignatureResponseMessage } from '@shared/message-types';

interface FormatMessageSigningResponseArgs {
  request: string;
  response: SignatureData | string;
}
export function formatMessageSigningResponse({
  request,
  response,
}: FormatMessageSigningResponseArgs): SignatureResponseMessage {
  return {
    source: MESSAGE_SOURCE,
    method: ExternalMethods.signatureResponse,
    payload: { signatureRequest: request, signatureResponse: response },
  };
}
