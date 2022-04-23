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
import { stxToMicroStx } from '@stacks/ui-utils';

import { todaysIsoDate } from '@app/common/date-utils';
import { finalizeTxSignature } from '@app/common/actions/finalize-tx-signature';
import { useWallet } from '@app/common/hooks/use-wallet';
import { broadcastTransaction } from '@app/common/transactions/broadcast-transaction';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { currentAccountState } from '@app/store/accounts';
import { currentNetworkState } from '@app/store/network/networks';
import {
  useStxTokenTransferUnsignedTxState,
  useFtTokenTransferUnsignedTx,
  useGenerateStxTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';
import { currentAccountLocallySubmittedTxsState } from '@app/store/accounts/account-activity';

import { postConditionsState } from './post-conditions';
import { requestTokenState } from './requests';
import {
  estimatedUnsignedTransactionByteLengthState,
  prepareTxDetailsForBroadcast,
  serializedUnsignedTransactionPayloadState,
  transactionAttachmentState,
  transactionBroadcastErrorState,
  unsignedStacksTransactionBaseState,
} from './index';
import { selectedAssetIdState } from '../assets/asset-search';
import { generateUnsignedTransaction } from '@app/common/transactions/generate-unsigned-txs';
import { logger } from '@shared/logger';

import { useCurrentAccount } from '../accounts/account.hooks';

export function useTransactionPostConditions() {
  return useAtomValue(postConditionsState);
}

export function useUnsignedPrepareTransactionDetails(values: TransactionFormValues) {
  const unsignedStacksTransaction = useUnsignedStacksTransaction(values);
  const sendFormUnsignedTx = useSendFormUnsignedTxPreviewState(values);
  return useMemo(
    () => unsignedStacksTransaction || sendFormUnsignedTx,
    [sendFormUnsignedTx, unsignedStacksTransaction]
  );
}

export function useUnserializedSignedTransactionPayloadState() {
  return useAtomValue(serializedUnsignedTransactionPayloadState);
}

export function useEstimatedUnsignedTransactionByteLengthState() {
  return useAtomValue(estimatedUnsignedTransactionByteLengthState);
}

export function useSerializedTransactionPayloadState(values?: TransactionFormValues) {
  const transaction = useSendFormUnsignedTxPreviewState(values);
  if (!transaction) return '';
  const serializedTxPayload = serializePayload(transaction.payload);
  return serializedTxPayload.toString('hex');
}

export function useEstimatedTransactionByteLength(values?: TransactionFormValues) {
  const transaction = useSendFormUnsignedTxPreviewState(values);
  if (!transaction) return null;
  const serializedTx = transaction.serialize();
  return serializedTx.byteLength;
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
  const { setLatestNonce } = useWallet();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();

  return useAtomCallback(
    useCallback(
      async (get, set, values: TransactionFormValues) => {
        const { account, attachment, requestToken, network, stacksTxBaseState } = await get(
          waitForAll({
            account: currentAccountState,
            attachment: transactionAttachmentState,
            requestToken: requestTokenState,
            network: currentNetworkState,
            stacksTxBaseState: unsignedStacksTransactionBaseState,
          }),
          { unstable_promise: true }
        );

        if (!stacksTxBaseState) return;
        const { options } = stacksTxBaseState as any;
        const unsignedStacksTransaction = await generateUnsignedTransaction({
          ...options,
          fee: stxToMicroStx(values.fee),
          nonce: Number(values.nonce) || options.nonce,
        });

        if (!account || !requestToken || !unsignedStacksTransaction) {
          set(transactionBroadcastErrorState, 'No pending transaction found.');
          return;
        }

        try {
          const signedTx = signSoftwareWalletTx(unsignedStacksTransaction);
          if (!signedTx) {
            logger.error('Cannot sign transaction, no account in state');
            return;
          }
          const { isSponsored, serialized, txRaw, nonce } = prepareTxDetailsForBroadcast(signedTx);
          const result = await broadcastTransaction({
            isSponsored,
            serialized,
            txRaw,
            attachment,
            networkUrl: network.url,
          });
          if (typeof nonce !== 'undefined') await setLatestNonce(nonce);
          finalizeTxSignature(requestToken, result);
          if (typeof result.txId === 'string') {
            set(currentAccountLocallySubmittedTxsState, {
              [result.txId]: {
                rawTx: result.txRaw,
                timestamp: todaysIsoDate(),
              },
            });
          }
        } catch (error) {
          if (error instanceof Error) set(transactionBroadcastErrorState, error.message);
        }
      },
      [setLatestNonce, signSoftwareWalletTx]
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
    new BN(amount, 10),
    assetInfo
  );
}

export function useGenerateUnsignedStacksTransaction() {
  return useAtomCallback(
    useCallback(async (get, _, values: TransactionFormValues) => {
      const stacksTxBaseState = get(unsignedStacksTransactionBaseState);
      if (!stacksTxBaseState) return undefined;
      const { options } = stacksTxBaseState as any;
      return generateUnsignedTransaction({
        ...options,
        fee: values.fee,
        nonce: Number(values.nonce) || options.nonce,
      });
    }, [])
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
