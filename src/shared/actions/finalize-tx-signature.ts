import { logger } from '@shared/logger';
import {
  ExternalMethods,
  MESSAGE_SOURCE,
  TransactionResponseMessage,
  TxResult,
} from '@shared/message-types';
import { analytics } from '@shared/utils/analytics';

interface FormatTxSignatureResponseArgs {
  payload: string;
  response: TxResult | 'cancel';
}
export function formatTxSignatureResponse({
  payload,
  response,
}: FormatTxSignatureResponseArgs): TransactionResponseMessage {
  return {
    source: MESSAGE_SOURCE,
    method: ExternalMethods.transactionResponse,
    payload: {
      transactionRequest: payload,
      transactionResponse: response,
    },
  };
}
interface FinalizeTxSignatureArgs {
  requestPayload: string;
  data: TxResult | 'cancel';
  tabId: number;
}

export function finalizeTxSignature({ requestPayload, data, tabId }: FinalizeTxSignatureArgs) {
  try {
    const responseMessage = formatTxSignatureResponse({ payload: requestPayload, response: data });
    chrome.tabs.sendMessage(tabId, responseMessage);
    window.close();
  } catch (e) {
    // EXPERIMENT:
    // My own testing shows that `sendMessage` doesn't throw yet users have
    // reported these errors. Tracking here to see if we are able to detect this
    // happening.
    void analytics.track('finalize_tx_signature_error_thrown', { data: e });
    logger.error(e);
  }
}
