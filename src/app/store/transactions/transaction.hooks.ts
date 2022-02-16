import { useCallback, useMemo } from 'react';
import BN from 'bn.js';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { useAtomCallback, useAtomValue, waitForAll } from 'jotai/utils';
import { useAsync } from 'react-async-hook';
import {
  createAssetInfo,
  createStacksPrivateKey,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  PostCondition,
  StacksTransaction,
  TransactionSigner,
} from '@stacks/transactions';

import { todaysIsoDate } from '@app/common/date-utils';
import { finalizeTxSignature } from '@app/common/actions/finalize-tx-signature';
import { useWallet } from '@app/common/hooks/use-wallet';
import { broadcastTransaction } from '@app/common/transactions/broadcast-transaction';
import { currentAccountState } from '@app/store/accounts';
import { currentNetworkState } from '@app/store/network/networks';
import {
  localStacksTransactionInputsState,
  useStxTokenTransferUnsignedTxState,
  useFtTokenTransferUnsignedTx,
} from '@app/store/transactions/local-transactions';
import { currentAccountLocallySubmittedTxsState } from '@app/store/accounts/account-activity';

import { postConditionsState } from './post-conditions';
import { requestTokenState } from './requests';
import { useCurrentSoftwareAccount } from '@app/store/accounts/account.hooks';
import {
  estimatedUnsignedTransactionByteLengthState,
  prepareTxDetailsForBroadcast,
  pendingTransactionState,
  serializedUnsignedTransactionPayloadState,
  transactionAttachmentState,
  transactionBroadcastErrorState,
  txByteSize,
  unsignedStacksTransactionState,
  unsignedTransactionState,
  unsignedStacksTransactionBaseState,
} from './index';
import { serializePayload } from '@stacks/transactions/dist/payload';
import { selectedAssetIdState } from '../assets/asset-search';
import { generateUnsignedTransaction } from '@app/common/transactions/generate-unsigned-txs';
import { logger } from '@shared/logger';
import { useCurrentKeyDetails } from '../keys/key.selectors';

export function usePendingTransaction() {
  return useAtomValue(pendingTransactionState);
}

export function useTransactionPostConditions() {
  return useAtomValue(postConditionsState);
}

export function useUnsignedTransaction() {
  return useAtomValue(unsignedTransactionState);
}

export function useUnserializedSignedTransactionPayloadState() {
  return useAtomValue(serializedUnsignedTransactionPayloadState);
}

export function useEstimatedUnsignedTransactionByteLengthState() {
  return useAtomValue(estimatedUnsignedTransactionByteLengthState);
}

export function useSerializedTransactionPayloadState() {
  const transaction = useSendFormUnsignedTxState();
  if (!transaction) return '';
  const serializedTxPayload = serializePayload(transaction.payload);
  return serializedTxPayload.toString('hex');
}

export function useEstimatedTransactionByteLength() {
  const transaction = useSendFormUnsignedTxState();
  if (!transaction) return null;
  const serializedTx = transaction.serialize();
  return serializedTx.byteLength;
}

export function useSignTransactionSoftwareWallet() {
  const currentKey = useCurrentKeyDetails();
  const account = useCurrentSoftwareAccount();
  return useCallback(
    (tx: StacksTransaction) => {
      if (currentKey?.type !== 'software') {
        toast.error('Cannot use this method to sign a non-software wallet transaction');
        return;
      }
      const signer = new TransactionSigner(tx);
      if (!account) return null;
      signer.signOrigin(createStacksPrivateKey(account.stxPrivateKey));
      return tx;
    },
    [account, currentKey?.type]
  );
}

export function useTransactionBroadcast() {
  const { setLatestNonce } = useWallet();
  const signSoftwareWalletTx = useSignTransactionSoftwareWallet();

  return useAtomCallback(
    useCallback(
      async (get, set) => {
        const { account, unsignedStacksTransaction, attachment, requestToken, network } = await get(
          waitForAll({
            account: currentAccountState,
            attachment: transactionAttachmentState,
            requestToken: requestTokenState,
            network: currentNetworkState,
            unsignedStacksTransaction: unsignedStacksTransactionState,
          }),
          { unstable_promise: true }
        );

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
function useUnsignedStacksTransaction() {
  const stacksTxBaseState = useAtomValue(unsignedStacksTransactionBaseState);
  return useAsync(async () => {
    if (!stacksTxBaseState) return undefined;
    const { options } = stacksTxBaseState as any;
    return generateUnsignedTransaction({ ...options });
  }, [stacksTxBaseState]).result;
}

export function useLocalTransactionInputsState() {
  return useAtom(localStacksTransactionInputsState);
}

export function useSendFormUnsignedTxState() {
  const isSendingStx = useIsSendingFormSendingStx();
  const stxTokenTransferUnsignedTx = useStxTokenTransferUnsignedTxState();
  const ftTokenTransferUnsignedTx = useFtTokenTransferUnsignedTx();
  return useMemo(
    () => (isSendingStx ? stxTokenTransferUnsignedTx : ftTokenTransferUnsignedTx),
    [isSendingStx, stxTokenTransferUnsignedTx, ftTokenTransferUnsignedTx]
  );
}

function useIsSendingFormSendingStx() {
  const selectedAssetId = useAtomValue(selectedAssetIdState);
  return selectedAssetId === '.::Stacks Token';
}

/**
 * @deprecated
 * Do not use implicit state-driven atom to get a "active" `StacksTransaction`
 * This atom uses the presence of `pendingTransaction` to determine whether the
 * "current" tx is either from a dApp, or the send form.
 *
 * Instead, be explicit when dealing with transaction broadcasts.
 */
export function useUnsignedTxForSettingsState() {
  const pendingTxState = useAtomValue(pendingTransactionState);
  const unsignedStacksTransaction = useUnsignedStacksTransaction();
  const sendFormUnsignedTx = useSendFormUnsignedTxState();
  return useMemo(
    () => (pendingTxState ? unsignedStacksTransaction : sendFormUnsignedTx),
    [pendingTxState, sendFormUnsignedTx, unsignedStacksTransaction]
  );
}

export function useTxByteSizeState() {
  return useAtom(txByteSize);
}
