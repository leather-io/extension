import { TxBroadcastResultRejected } from '@stacks/transactions';

export function getErrorMessage(
  reason:
    | TxBroadcastResultRejected['reason']
    | 'ConflictingNonceInMempool'
    | 'TransferRecipientCannotEqualSender'
) {
  switch (reason) {
    case 'TransferRecipientCannotEqualSender':
      return 'You cannot transfer STX to yourself.';
    case 'ConflictingNonceInMempool':
      return 'Nonce conflict, try again soon.';
    case 'BadNonce':
      return 'Incorrect nonce.';
    case 'NotEnoughFunds':
      return 'Not enough funds.';
    case 'FeeTooLow':
      return 'Fee is too low.';
    default:
      return 'Something went wrong';
  }
}
