import { useCallback, useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import toast from 'react-hot-toast';

import { bytesToHex } from '@stacks/common';
import { TransactionTypes } from '@stacks/connect';
import {
  FungibleConditionCode,
  PostCondition,
  StacksTransaction,
  TransactionSigner,
  createAssetInfo,
  createStacksPrivateKey,
  makeStandardFungiblePostCondition,
  serializePayload,
} from '@stacks/transactions';
import BN from 'bn.js';

import { finalizeTxSignature } from '@shared/actions/finalize-tx-signature';
import { logger } from '@shared/logger';
import { SendFormValues, TransactionFormValues } from '@shared/models/form.model';
import { isString, isUndefined } from '@shared/utils';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { stxToMicroStx } from '@app/common/money/unit-conversion';
import { validateStacksAddress } from '@app/common/stacks-utils';
import { broadcastTransaction } from '@app/common/transactions/stacks/broadcast-transaction';
import {
  GenerateUnsignedTransactionOptions,
  generateUnsignedTransaction,
} from '@app/common/transactions/stacks/generate-unsigned-txs';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import {
  useCurrentAccount,
  useCurrentAccountStxAddressState,
} from '@app/store/accounts/account.hooks';
import {
  useCurrentNetworkState,
  useCurrentStacksNetworkState,
} from '@app/store/networks/networks.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
  useGenerateStxTokenTransferUnsignedTx,
  useStxTokenTransferUnsignedTxState,
} from '@app/store/transactions/token-transfer.hooks';

import { usePostConditionState } from './post-conditions.hooks';
import { useTransactionRequest, useTransactionRequestState } from './requests.hooks';
import { prepareTxDetailsForBroadcast } from './transaction';

export function useTransactionPostConditions() {
  return usePostConditionState();
}

function useTransactionAttachment() {
  return useTransactionRequestState()?.attachment;
}

function useUnsignedStacksTransactionBaseState() {
  const network = useCurrentStacksNetworkState();
  const { nonce } = useNextNonce();
  const stxAddress = useCurrentAccountStxAddressState();
  const payload = useTransactionRequestState();
  const postConditions = useTransactionPostConditions();
  const account = useCurrentAccount();

  const options = useMemo(
    () => ({
      fee: 0,
      publicKey: account?.stxPublicKey,
      nonce: nonce || 0,
      txData: { ...payload, postConditions, network },
    }),
    [account?.stxPublicKey, network, nonce, payload, postConditions]
  );

  const transaction = useAsync(async () => {
    return generateUnsignedTransaction(options as GenerateUnsignedTransactionOptions);
  }, [account, nonce, payload, stxAddress]).result;

  return useMemo(() => {
    if (!account || !payload || !stxAddress) return { transaction: undefined, options };

    if (
      payload.txType === TransactionTypes.ContractCall &&
      !validateStacksAddress(payload.contractAddress)
    ) {
      return { transaction: undefined, options };
    }

    return { transaction, options };
  }, [account, options, payload, stxAddress, transaction]);
}

export function useUnsignedPrepareTransactionDetails(values: TransactionFormValues) {
  const unsignedStacksTransaction = useUnsignedStacksTransaction(values);
  return useMemo(() => unsignedStacksTransaction, [unsignedStacksTransaction]);
}

/**
 * Refactored with new send form; remove with legacy send form.
 * @deprecated
 */
export function useSendFormSerializedUnsignedTxPayloadState(
  selectedAssetId: string,
  values?: SendFormValues
) {
  const transaction = useSendFormUnsignedTxPreviewState(selectedAssetId, values);
  if (!transaction) return '';
  return bytesToHex(serializePayload(transaction.payload));
}

/**
 * Refactored with new send form; remove with legacy send form.
 * @deprecated
 */
export function useSendFormEstimatedUnsignedTxByteLengthState(
  selectedAssetId: string,
  values?: SendFormValues
) {
  const transaction = useSendFormUnsignedTxPreviewState(selectedAssetId, values);
  if (!transaction) return null;
  return transaction.serialize().byteLength;
}

/**
 * Refactor and remove with new fees row component.
 * @deprecated
 */
export function useTxRequestSerializedUnsignedTxPayloadState() {
  const { transaction } = useUnsignedStacksTransactionBaseState();
  if (!transaction) return '';
  return bytesToHex(serializePayload(transaction.payload));
}

/**
 * Refactor and remove with new fees row component.
 * @deprecated
 */
export function useTxRequestEstimatedUnsignedTxByteLengthState() {
  const { transaction } = useUnsignedStacksTransactionBaseState();
  if (!transaction) return null;
  return transaction.serialize().byteLength;
}

export function useSignTransactionSoftwareWallet() {
  const account = useCurrentAccount();
  return useCallback(
    (tx: StacksTransaction) => {
      if (account?.type !== 'software') {
        [toast.error, logger.error].forEach(fn =>
          fn('Cannot use this method to sign a non-software wallet transaction')
        );
        return;
      }
      const signer = new TransactionSigner(tx);
      if (!account) return null;
      signer.signOrigin(createStacksPrivateKey(account.stxPrivateKey));
      return tx;
    },
    [account]
  );
}

export function useTransactionBroadcast() {
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const { tabId } = useDefaultRequestParams();
  const requestToken = useTransactionRequest();
  const attachment = useTransactionAttachment();
  const network = useCurrentNetworkState();

  return async ({ signedTx }: { signedTx: StacksTransaction }) => {
    try {
      const { isSponsored, serialized, txRaw } = prepareTxDetailsForBroadcast(signedTx);
      const result = await broadcastTransaction({
        isSponsored,
        serialized,
        txRaw,
        attachment,
        networkUrl: network.chain.stacks.url,
      });

      if (isString(result.txId)) {
        submittedTransactionsActions.newTransactionSubmitted({
          rawTx: result.txRaw,
          txId: result.txId,
        });
      }

      // If there's a request token, this means it's a transaction request
      // In which case we need to return to the app the results of the tx
      // Otherwise, it's a send form tx and we don't want to
      if (requestToken && tabId) {
        finalizeTxSignature({ requestPayload: requestToken, tabId, data: result });
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export function useSoftwareWalletTransactionRequestBroadcast() {
  const { nonce } = useNextNonce();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();
  const stacksTxBaseState = useUnsignedStacksTransactionBaseState();
  const { tabId } = useDefaultRequestParams();
  const requestToken = useTransactionRequest();
  const account = useCurrentAccount();
  const txBroadcast = useTransactionBroadcast();

  return async (values: TransactionFormValues) => {
    if (!stacksTxBaseState) return;
    const { options } = stacksTxBaseState as any;
    const unsignedStacksTransaction = await generateUnsignedTransaction({
      ...options,
      fee: stxToMicroStx(values.fee).toNumber(),
      nonce: Number(values.nonce) ?? nonce,
    });

    if (!account || !requestToken || !unsignedStacksTransaction) {
      return { error: { message: 'No pending transaction' } };
    }

    if (!tabId) throw new Error('tabId not defined');

    const signedTx = signSoftwareWalletTx(unsignedStacksTransaction);
    if (!signedTx) {
      logger.error('Cannot sign transaction, no account in state');
      return;
    }
    return txBroadcast({ signedTx });
  };
}

interface PostConditionsOptions {
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
  stxAddress: string;
  amount: string | number;
}
export function makePostCondition(options: PostConditionsOptions): PostCondition {
  const { contractAddress, contractAssetName, contractName, stxAddress, amount } = options;

  const assetInfo = createAssetInfo(contractAddress, contractName, contractAssetName);
  return makeStandardFungiblePostCondition(
    stxAddress,
    FungibleConditionCode.Equal,
    new BN(amount, 10).toString(),
    assetInfo
  );
}

export function useGenerateUnsignedStacksTransaction() {
  const stacksTxBaseState = useUnsignedStacksTransactionBaseState();
  const { nonce } = useNextNonce();

  return useCallback(
    (values: TransactionFormValues) => {
      if (!stacksTxBaseState || isUndefined(nonce)) return undefined;
      const { options } = stacksTxBaseState as any;
      return generateUnsignedTransaction({
        ...options,
        fee: stxToMicroStx(values.fee).toNumber(),
        nonce: Number(values.nonce) ?? nonce,
      });
    },
    [nonce, stacksTxBaseState]
  );
}

function useUnsignedStacksTransaction(values: TransactionFormValues) {
  const generateTx = useGenerateUnsignedStacksTransaction();

  const tx = useAsync(async () => {
    return generateTx(values ?? undefined);
  }, [values]);

  return tx.result;
}

function isSendingFormSendingStx(assetId: string) {
  return assetId === '::stacks-token';
}

export function useGenerateSendFormUnsignedTx(selectedAssetId: string) {
  const isSendingStx = isSendingFormSendingStx(selectedAssetId);
  const stxTokenTransferUnsignedTx = useGenerateStxTokenTransferUnsignedTx();
  const ftTokenTransferUnsignedTx = useGenerateFtTokenTransferUnsignedTx(selectedAssetId);

  return useMemo(
    () => (isSendingStx ? stxTokenTransferUnsignedTx : ftTokenTransferUnsignedTx),
    [ftTokenTransferUnsignedTx, isSendingStx, stxTokenTransferUnsignedTx]
  );
}

/**
 * Refactored with new send form; remove with legacy send form.
 * @deprecated
 */
export function useSendFormUnsignedTxPreviewState(
  selectedAssetId: string,
  values?: SendFormValues
) {
  const isSendingStx = isSendingFormSendingStx(selectedAssetId);
  const stxTokenTransferUnsignedTx = useStxTokenTransferUnsignedTxState(values);
  const ftTokenTransferUnsignedTx = useFtTokenTransferUnsignedTx(selectedAssetId, values);

  return useMemo(
    () => (isSendingStx ? stxTokenTransferUnsignedTx : ftTokenTransferUnsignedTx),
    [ftTokenTransferUnsignedTx, isSendingStx, stxTokenTransferUnsignedTx]
  );
}
