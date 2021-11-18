import { useCallback } from 'react';
import BN from 'bn.js';
import { useAtom } from 'jotai';
import { useAtomCallback, useAtomValue, waitForAll } from 'jotai/utils';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  PostCondition,
} from '@stacks/transactions';

import { todaysIsoDate } from '@common/date-utils';
import { finalizeTxSignature } from '@common/actions/finalize-tx-signature';
import { useWallet } from '@common/hooks/use-wallet';
import { broadcastTransaction } from '@common/transactions/broadcast-transaction';
import { logger } from '@common/logger';
import { currentAccountState } from '@store/accounts';
import { currentNetworkState } from '@store/network/networks';
import { localStacksTransactionInputsState } from '@store/transactions/local-transactions';
import { currentAccountLocallySubmittedTxsState } from '@store/accounts/account-activity';

import {
  estimatedTransactionByteLengthState,
  estimatedUnsignedTransactionByteLengthState,
  pendingTransactionState,
  serializedTransactionPayloadState,
  serializedUnsignedTransactionPayloadState,
  signedTransactionState,
  transactionAttachmentState,
  transactionBroadcastErrorState,
  txByteSize,
  txForSettingsState,
  unsignedTransactionState,
} from './index';
import { postConditionsState } from './post-conditions';
import { requestTokenState } from './requests';

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
  return useAtomValue(serializedTransactionPayloadState);
}

export function useEstimatedTransactionByteLengthState() {
  return useAtomValue(estimatedTransactionByteLengthState);
}

export function useTransactionBroadcast() {
  const { setLatestNonce } = useWallet();
  return useAtomCallback(
    useCallback(
      async (get, set) => {
        const { account, signedTransaction, attachment, requestToken, network } = await get(
          waitForAll({
            // TODO: @kyranjamie
            // Need to replace this mechanism to so that this broadcast hook
            // doesn't implictly read the stxPrivateKey to create a signed tx
            signedTransaction: signedTransactionState,
            account: currentAccountState,
            attachment: transactionAttachmentState,
            requestToken: requestTokenState,
            network: currentNetworkState,
          }),
          true
        );
        if (!account || !requestToken || !signedTransaction) {
          set(transactionBroadcastErrorState, 'No pending transaction found.');
          return;
        }

        try {
          const { isSponsored, serialized, txRaw, nonce } = signedTransaction;
          const result = await broadcastTransaction({
            isSponsored,
            serialized,
            txRaw,
            attachment,
            networkUrl: network.url,
          });
          typeof nonce !== 'undefined' && (await setLatestNonce(nonce));
          finalizeTxSignature(requestToken, result);
          if (result.txId) {
            set(currentAccountLocallySubmittedTxsState, {
              [result.txId]: {
                rawTx: result.txRaw,
                timestamp: todaysIsoDate(),
              },
            });
          }
        } catch (error) {
          logger.error(error);
          if (error instanceof Error) set(transactionBroadcastErrorState, error.message);
        }
      },
      [setLatestNonce]
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

export const useLocalTransactionInputsState = () => useAtom(localStacksTransactionInputsState);

export const useTxForSettingsState = () => useAtom(txForSettingsState);

export const useTxByteSizeState = () => useAtom(txByteSize);
