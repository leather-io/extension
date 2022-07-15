import { TxBroadcastResultRejected } from '@stacks/transactions';

// TODO: Errors to handle
//
// Also ref: https://github.com/stacks-network/stacks-blockchain/blob/master/src/chainstate/stacks/db/blocks.rs#L259
//
//   PoisonMicroblocksDoNotConflict = 'PoisonMicroblocksDoNotConflict',
//   PoisonMicroblockHasUnknownPubKeyHash = 'PoisonMicroblockHasUnknownPubKeyHash',
//   PoisonMicroblockIsInvalid = 'PoisonMicroblockIsInvalid',
//   BadAddressVersionByte = 'BadAddressVersionByte',
//   NoCoinbaseViaMempool = 'NoCoinbaseViaMempool',
//   ServerFailureNoSuchChainTip = 'ServerFailureNoSuchChainTip',
//   ServerFailureDatabase = 'ServerFailureDatabase',
//   ServerFailureOther = 'ServerFailureOther',

export function getErrorMessage(
  reason:
    | TxBroadcastResultRejected['reason']
    | 'BadTransactionVersion'
    | 'ConflictingNonceInMempool'
    | 'EstimatorError'
    | 'TransferAmountMustBePositive'
    | 'TransferRecipientCannotEqualSender'
) {
  switch (reason) {
    case 'BadFunctionArgument':
      return 'Incorrect function argument';
    case 'BadNonce':
      return 'Incorrect nonce';
    case 'BadTransactionVersion':
      return 'Incorrect transaction version';
    case 'ConflictingNonceInMempool':
      return 'Nonce conflict';
    case 'ContractAlreadyExists':
      return 'Contract already exists';
    case 'Deserialization':
      return 'Deserialization failure';
    case 'EstimatorError':
      return 'Estimator error';
    case 'FeeTooLow':
      return 'Fee too low';
    case 'NoSuchContract':
      return 'Contract does not exist';
    case 'NoSuchPublicFunction':
      return 'Function does not exist';
    case 'NotEnoughFunds':
      return 'Not enough funds';
    case 'Serialization':
      return 'Serialization failure';
    case 'SignatureValidation':
      return 'Failed to validate signature';
    case 'TransferAmountMustBePositive':
      return 'Transfer amount must be positive';
    case 'TransferRecipientCannotEqualSender':
      return 'Cannot transfer STX to yourself';
    default:
      return 'Something went wrong';
  }
}
