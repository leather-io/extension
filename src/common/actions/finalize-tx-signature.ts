import {
  ExternalMethods,
  MESSAGE_SOURCE,
  TransactionResponseMessage,
  TxResult,
} from '@common/message-types';
import { deleteTabForRequest, getTab, StorageKey } from '@common/storage';

export const finalizeTxSignature = (requestPayload: string, data: TxResult | string) => {
  try {
    const tabId = getTab(StorageKey.transactionRequests, requestPayload);
    const responseMessage: TransactionResponseMessage = {
      source: MESSAGE_SOURCE,
      method: ExternalMethods.transactionResponse,
      payload: {
        transactionRequest: requestPayload,
        transactionResponse: data,
      },
    };
    chrome.tabs.sendMessage(tabId, responseMessage);
    deleteTabForRequest(StorageKey.transactionRequests, requestPayload);
    // If this is a string, then the transaction has been canceled
    // and the user has closed the window
    if (typeof data !== 'string') window.close();
  } catch (error) {
    console.debug('Failed to get Tab ID for transaction request:', requestPayload);
    throw new Error(
      'Your transaction was broadcasted, but we lost communication with the app you started with.'
    );
  }
};
