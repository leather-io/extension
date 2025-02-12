import { SignatureData } from '@stacks/connect-jwt';

import { closeWindow } from '@shared/utils';

import { formatMessageSigningResponse } from './finalize-message-signature-format';

interface FinalizeMessageSignatureArgs {
  requestPayload: string;
  tabId: number;
  data: SignatureData | string;
}
export function finalizeMessageSignature({
  requestPayload,
  data,
  tabId,
}: FinalizeMessageSignatureArgs) {
  const responseMessage = formatMessageSigningResponse({ request: requestPayload, response: data });
  chrome.tabs.sendMessage(tabId, responseMessage);
  closeWindow();
}
