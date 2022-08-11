import { useCallback, useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import BN from 'bn.js';
import toast from 'react-hot-toast';
import { useAtomCallback, useAtomValue, waitForAll } from 'jotai/utils';
import {
  createAssetInfo,
  createStacksPrivateKey,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  PostCondition,
  serializePayload,
  StacksTransaction,
  TransactionSigner,
} from '@stacks/transactions';

import { finalizeTxSignature } from '@shared/actions/finalize-tx-signature';
import { stxToMicroStx } from '@app/common/stacks-utils';
import { broadcastTransaction } from '@app/common/transactions/broadcast-transaction';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { currentNetworkState } from '@app/store/network/networks';
import {
  useStxTokenTransferUnsignedTxState,
  useFtTokenTransferUnsignedTx,
  useGenerateStxTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';
import { useNextNonce } from '@app/query/nonce/account-nonces.hooks';
import { TransactionTypes } from '@stacks/connect';
import { validateStacksAddress } from '@app/common/stacks-utils';
import {
  generateUnsignedTransaction,
  GenerateUnsignedTransactionOptions,
} from '@app/common/transactions/generate-unsigned-txs';
import { selectedAssetIdState } from '@app/store/assets/asset-search';
import {
  useCurrentAccount,
  useCurrentAccountStxAddressState,
} from '@app/store/accounts/account.hooks';
import {
  useCurrentNetworkState,
  useCurrentStacksNetworkState,
} from '@app/store/network/networks.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { logger } from '@shared/logger';
import { isUndefined } from '@shared/utils';

import { prepareTxDetailsForBroadcast, transactionBroadcastErrorState } from './transaction';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { usePostConditionState } from './post-conditions.hooks';
import { useTransactionRequest, useTransactionRequestState } from './requests.hooks';

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
  const sendFormUnsignedTx = useSendFormUnsignedTxPreviewState(values);
  return useMemo(
    () => unsignedStacksTransaction || sendFormUnsignedTx,
    [sendFormUnsignedTx, unsignedStacksTransaction]
  );
}

export function useSendFormSerializedUnsignedTxPayloadState(values?: TransactionFormValues) {
  const transaction = useSendFormUnsignedTxPreviewState(values);
  if (!transaction) return '';
  return serializePayload(transaction.payload).toString('hex');
}

export function useSendFormEstimatedUnsignedTxByteLengthState(values?: TransactionFormValues) {
  const transaction = useSendFormUnsignedTxPreviewState(values);
  if (!transaction) return null;
  return transaction.serialize().byteLength;
}

export function useTxRequestSerializedUnsignedTxPayloadState() {
  const { transaction } = useUnsignedStacksTransactionBaseState();
  if (!transaction) return '';
  return serializePayload(transaction.payload).toString('hex');
}

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

export function useSoftwareWalletTransactionBroadcast() {
  const { nonce } = useNextNonce();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();
  const stacksTxBaseState = useUnsignedStacksTransactionBaseState();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const { tabId } = useDefaultRequestParams();
  const requestToken = useTransactionRequest();
  const attachment = useTransactionAttachment();
  const account = useCurrentAccount();
  const network = useCurrentNetworkState();

  return useAtomCallback(
    useCallback(
      async (_get, set, values: TransactionFormValues) => {
        if (!stacksTxBaseState) return;
        const { options } = stacksTxBaseState as any;
        const unsignedStacksTransaction = await generateUnsignedTransaction({
          ...options,
          fee: stxToMicroStx(values.fee).toNumber(),
          nonce: Number(values.nonce) ?? nonce,
        });

        if (!account || !requestToken || !unsignedStacksTransaction) {
          set(transactionBroadcastErrorState, 'No pending transaction');
          return;
        }

        if (!tabId) throw new Error('tabId not defined');

        try {
          const signedTx = signSoftwareWalletTx(unsignedStacksTransaction);
          if (!signedTx) {
            logger.error('Cannot sign transaction, no account in state');
            return;
          }
          const { isSponsored, serialized, txRaw } = prepareTxDetailsForBroadcast(signedTx);
          const result = await broadcastTransaction({
            isSponsored,
            serialized,
            txRaw,
            attachment,
            networkUrl: network.url,
          });

          if (typeof result.txId === 'string') {
            submittedTransactionsActions.newTransactionSubmitted({
              rawTx: result.txRaw,
              txId: result.txId,
            });
          }
          finalizeTxSignature({ requestPayload: requestToken, data: result, tabId });
        } catch (error) {
          if (error instanceof Error) set(transactionBroadcastErrorState, error.message);
        }
      },
      [
        account,
        attachment,
        network,
        nonce,
        requestToken,
        signSoftwareWalletTx,
        stacksTxBaseState,
        submittedTransactionsActions,
        tabId,
      ]
    )
  );
}

//
// TODO: duplicated from software wallet hook above
// Broadcasting logic needs a complete refactor
export function useHardwareWalletTransactionBroadcast() {
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const { tabId } = useDefaultRequestParams();
  const requestToken = useTransactionRequest();
  const attachment = useTransactionAttachment();

  return useAtomCallback(
    useCallback(
      async (get, set, { signedTx }: { signedTx: StacksTransaction }) => {
        const { network } = await get(
          waitForAll({
            network: currentNetworkState,
          }),
          { unstable_promise: true }
        );

        try {
          const { isSponsored, serialized, txRaw } = prepareTxDetailsForBroadcast(signedTx);
          const result = await broadcastTransaction({
            isSponsored,
            serialized,
            txRaw,
            attachment,
            networkUrl: network.url,
          });
          if (typeof result.txId === 'string') {
            submittedTransactionsActions.newTransactionSubmitted({
              rawTx: result.txRaw,
              txId: result.txId,
            });
          }
          // If there's a request token, this means it's a transaction request
          // In which case we need to return to the app the results of the tx
          // Otherwise, it's a send form tx and we don't want to
          if (requestToken && tabId)
            finalizeTxSignature({ requestPayload: requestToken, tabId, data: result });
        } catch (error) {
          if (error instanceof Error) set(transactionBroadcastErrorState, error.message);
        }
      },
      [attachment, requestToken, submittedTransactionsActions, tabId]
    )
  );
}

interface PostConditionsOptions {
  contractAddress: string;
  contractName: string;
  assetName: string;
  stxAddress: string;
  amount: string | number;
}
export function makePostCondition(options: PostConditionsOptions): PostCondition {
  const { contractAddress, contractName, assetName, stxAddress, amount } = options;

  const assetInfo = createAssetInfo(contractAddress, contractName, assetName);
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

export function useGenerateSendFormUnsignedTx() {
  const isSendingStx = useIsSendingFormSendingStx();
  const stxTokenTransferUnsignedTx = useGenerateStxTokenTransferUnsignedTx();
  const ftTokenTransferUnsignedTx = useGenerateFtTokenTransferUnsignedTx();
  return useMemo(
    () => (isSendingStx ? stxTokenTransferUnsignedTx : ftTokenTransferUnsignedTx),
    [isSendingStx, stxTokenTransferUnsignedTx, ftTokenTransferUnsignedTx]
  );
}

export function useSendFormUnsignedTxPreviewState(values?: TransactionFormValues) {
  const isSendingStx = useIsSendingFormSendingStx();
  const stxTokenTransferUnsignedTx = useStxTokenTransferUnsignedTxState(values);
  const ftTokenTransferUnsignedTx = useFtTokenTransferUnsignedTx(values);
  return useMemo(
    () => (isSendingStx ? stxTokenTransferUnsignedTx : ftTokenTransferUnsignedTx),
    [isSendingStx, stxTokenTransferUnsignedTx, ftTokenTransferUnsignedTx]
  );
}

function useIsSendingFormSendingStx() {
  const selectedAssetId = useAtomValue(selectedAssetIdState);
  return selectedAssetId === '.::Stacks Token';
}
