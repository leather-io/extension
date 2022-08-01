import { TxBroadcastResultRejected } from '@stacks/transactions';

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
    case 'BadAddressVersionByte':
      return 'Incorrect address';
    case 'BadFunctionArgument':
      return 'Incorrect function argument';
    case 'BadNonce':
      return 'Incorrect nonce';
    case 'BadTransactionVersion':
      return 'Incorrect transaction';
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
    case 'NoCoinbaseViaMempool':
      return 'No coinbase via mempool';
    case 'NoSuchContract':
      return 'Contract does not exist';
    case 'NoSuchPublicFunction':
      return 'Function does not exist';
    case 'NotEnoughFunds':
      return 'Not enough funds';
    case 'PoisonMicroblocksDoNotConflict':
      return 'Microblock conflict';
    case 'PoisonMicroblockHasUnknownPubKeyHash':
      return 'No anchor block with public key hash';
    case 'PoisonMicroblockIsInvalid':
      return 'Invalid microblock';
    case 'Serialization':
      return 'Serialization failure';
    case 'ServerFailureDatabase':
      return 'Database error';
    case 'ServerFailureNoSuchChainTip':
      return 'No such chain tip';
    case 'ServerFailureOther':
      return 'Server failure';
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
