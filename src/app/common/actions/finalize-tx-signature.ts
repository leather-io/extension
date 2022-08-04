import {
  ExternalMethods,
  MESSAGE_SOURCE,
  TransactionResponseMessage,
  TxResult,
} from '@shared/message-types';

import { logger } from '@shared/logger';

interface FinalizeTxSignatureArgs {
  requestPayload: string;
  data: TxResult | string;
  tabId: number;
}
export function finalizeTxSignature({ requestPayload, data, tabId }: FinalizeTxSignatureArgs) {
  try {
    const responseMessage: TransactionResponseMessage = {
      source: MESSAGE_SOURCE,
      method: ExternalMethods.transactionResponse,
      payload: {
        transactionRequest: requestPayload,
        transactionResponse: data,
      },
    };
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
