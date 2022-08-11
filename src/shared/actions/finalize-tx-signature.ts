import {
  ExternalMethods,
  MESSAGE_SOURCE,
  TransactionResponseMessage,
  TxResult,
} from '@shared/message-types';
import { logger } from '@shared/logger';

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

    // If this is a string, then the transaction has been canceled
    // and the user has closed the window
    if (typeof data !== 'string') window.close();
  } catch (error) {
    logger.debug('Failed to get Tab ID for transaction request:', requestPayload);
    throw new Error(
      'Your transaction was broadcasted, but we lost communication with the app you started with.'
    );
  }
}
