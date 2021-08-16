import {
  ExternalMethods,
  MESSAGE_SOURCE,
  TransactionResponseMessage,
  TxResult,
} from '@shared/message-types';

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
