import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import { AuthOptions, TransactionTypes } from '@stacks/connect';
import {
  AddressHashMode,
  AuthType,
  MultiSigHashMode,
  PayloadType,
  StacksTransaction,
  addressToString,
  cvToValue,
  deserializeTransaction,
  serializeCV,
} from '@stacks/transactions';
import { MultiSigSpendingCondition } from '@stacks/transactions/src/authorization';

import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { useRejectIfLedgerWallet } from '@app/common/rpc-helpers';
import { StacksTransactionProvider } from '@app/features/stacks-transaction-request/components/stacks-transaction.context';
import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useSignTransactionSoftwareWallet } from '@app/store/transactions/transaction.hooks';
import { bytesToHex } from '@stacks/common';

const MEMO_DESERIALIZATION_STUB = '\u0000';

const cleanMemoString = (memo: string): string => {
  return memo.replaceAll(MEMO_DESERIALIZATION_STUB, '');
};

export const transactionPayloadToTransactionRequest = (
  stacksTransaction: StacksTransaction,
  stxAddress?: string,
  attachment?: string
) => {
  let transactionRequest = {
    ...stacksTransaction,
    attachment,
    stxAddress,
    sponsored: stacksTransaction.auth.authType === AuthType.Sponsored,
    nonce: Number(stacksTransaction.auth.spendingCondition.nonce),
    fee: stacksTransaction.auth.spendingCondition.fee,
    postConditions: stacksTransaction.postConditions.values,
  } as any;

  switch (stacksTransaction.payload.payloadType) {
    case PayloadType.TokenTransfer:
      transactionRequest.txType = TransactionTypes.STXTransfer;
      transactionRequest.recipient = cvToValue<string>(stacksTransaction.payload.recipient, true);
      transactionRequest.amount = Number(stacksTransaction.payload.amount);
      transactionRequest.memo = cleanMemoString(stacksTransaction.payload.memo.content);
      break;
    case PayloadType.ContractCall:
      transactionRequest.txType = TransactionTypes.ContractCall;
      transactionRequest.contractName = stacksTransaction.payload.contractName.content;
      transactionRequest.contractAddress = addressToString(
        stacksTransaction.payload.contractAddress
      );
      transactionRequest.functionArgs = stacksTransaction.payload.functionArgs.map(arg =>
        Buffer.from(serializeCV(arg)).toString('hex')
      );
      transactionRequest.functionName = stacksTransaction.payload.functionName.content;
      break;
    case PayloadType.SmartContract:
      transactionRequest.txType = TransactionTypes.ContractDeploy;
      transactionRequest.contractName = stacksTransaction.payload.contractName.content;
      transactionRequest.codeBody = stacksTransaction.payload.codeBody.content;
      break;
    default:
      throw new Error('Unsupported tx type');
  }

  return transactionRequest;
};

function useRpcSignStacksTransactionParams() {
  useRejectIfLedgerWallet('signStacksTransaction');

  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestId = searchParams.get('requestId');
  const transactionHex = searchParams.get('transactionHex');
  const stxAddress = searchParams.get('stxAddress');
  const attachment = searchParams.get('attachment');

  if (!requestId || !transactionHex || !origin || !stxAddress)
    throw new Error('Invalid params');

  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 0,
      requestId,
      stxAddress,
      attachment: attachment || undefined,
      stacksTransaction: deserializeTransaction(transactionHex),
    }),
    [origin, transactionHex, requestId, stxAddress, tabId, attachment]
  );
}

function useRpcSignStacksTransaction() {
  const { origin, requestId, stxAddress, tabId, attachment, stacksTransaction } =
    useRpcSignStacksTransactionParams();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();
  const hashMode = stacksTransaction.auth.spendingCondition.hashMode as MultiSigHashMode;
  const isMultisig =
    hashMode === AddressHashMode.SerializeP2SH || hashMode === AddressHashMode.SerializeP2WSH;
  const wasSignedByOtherOwners =
    isMultisig &&
    (stacksTransaction.auth.spendingCondition as MultiSigSpendingCondition).fields?.length > 0;

  return {
    origin,
    get transactionRequest() {
      return transactionPayloadToTransactionRequest(
        stacksTransaction,
        stxAddress,
        attachment
      );
    },
    disableFeeSelection: wasSignedByOtherOwners,
    disableNonceSelection: wasSignedByOtherOwners,
    stacksTransaction,
    onSignStacksTransaction(fee: number, nonce: number) {
      stacksTransaction.setFee(fee);
      stacksTransaction.setNonce(nonce);

      const signedTransaction = signSoftwareWalletTx(stacksTransaction);
      if (!signedTransaction) {
        throw new Error('Error signing stacks transaction');
      }

      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('signStacksTransaction', {
          id: requestId,
          result: {
            transactionHex: bytesToHex(signedTransaction.serialize()),
          },
        })
      );
      window.close();
    },
    onCancel() {
      chrome.tabs.sendMessage(
        tabId,
        makeRpcErrorResponse('signStacksTransaction', {
          id: requestId,
          error: {
            message: 'User denied signing stacks transaction',
            code: RpcErrorCode.USER_REJECTION,
          },
        })
      );
    },
  };
}

export function RpcSignStacksTransaction() {
  const {
    origin,
    onSignStacksTransaction,
    onCancel,
    transactionRequest,
    disableFeeSelection,
    stacksTransaction,
    disableNonceSelection,
  } = useRpcSignStacksTransaction();
  if (!transactionRequest) return null;

  return (
    <StacksTransactionProvider value={transactionRequest}>
      <StacksTransactionSigner
        onSignStacksTransaction={onSignStacksTransaction}
        onCancel={onCancel}
        stacksTransaction={stacksTransaction}
        disableFeeSelection={disableFeeSelection}
        disableNonceSelection={disableNonceSelection}
      />
    </StacksTransactionProvider>
  );
}
