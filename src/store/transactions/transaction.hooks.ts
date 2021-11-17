import { useCallback } from 'react';
import BN from 'bn.js';
import { useAtom } from 'jotai';
import { useAtomCallback, useAtomValue, waitForAll } from 'jotai/utils';

import { todaysIsoDate } from '@common/date-utils';
import { finalizeTxSignature } from '@common/actions/finalize-tx-signature';
import { useWallet } from '@common/hooks/use-wallet';
import { stxToMicroStx } from '@common/stacks-utils';
import { broadcastTransaction } from '@common/transactions/broadcast-transaction';
import {
  AnchorMode,
  createAssetInfo,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  makeSTXTokenTransfer,
  PostCondition,
  StacksTransaction,
} from '@stacks/transactions';

import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { currentAccountNonceState } from '@store/accounts/nonce';
import { currentNetworkState, currentStacksNetworkState } from '@store/network/networks';
import { localStacksTransactionInputsState } from '@store/transactions/local-transactions';
import { currentAccountLocallySubmittedTxsState } from '@store/accounts/account-activity';

import { updateTransactionFee } from '@store/transactions/utils';

import {
  estimatedSignedTransactionByteLengthState,
  estimatedTransactionByteLengthState,
  pendingTransactionState,
  serializedSignedTransactionPayloadState,
  serializedTransactionPayloadState,
  signedTransactionState,
  transactionAttachmentState,
  transactionBroadcastErrorState,
  txByteSize,
  txForSettingsState,
} from './index';
import { postConditionsState } from './post-conditions';
import { requestTokenState } from './requests';
import { logger } from '@common/logger';

export function usePendingTransaction() {
  return useAtomValue(pendingTransactionState);
}

export function useTransactionPostConditions() {
  return useAtomValue(postConditionsState);
}

/** @deprecated */
export function useSignedTransaction() {
  return useAtomValue(signedTransactionState);
}

// See notes by atoms for these duplicated hooks using
// different transaction states. This should be looked at
// with the new transaction signing flow. These are used
// for getting the fee estimates.
/** @deprecated */
export function useSerializedSignedTransactionPayloadState() {
  return useAtomValue(serializedSignedTransactionPayloadState);
}

export function useEstimatedSignedTransactionByteLengthState() {
  return useAtomValue(estimatedSignedTransactionByteLengthState);
}

export function useSerializedTransactionPayloadState() {
  return useAtomValue(serializedTransactionPayloadState);
}

export function useEstimatedTransactionByteLengthState() {
  return useAtomValue(estimatedTransactionByteLengthState);
}

interface TokenTransferParams {
  amount: number;
  recipient: string;
  memo: string;
  feeRate: number;
}

export function useMakeStxTransfer() {
  return useAtomCallback<undefined | StacksTransaction, TokenTransferParams>(
    useCallback(async (get, _set, arg) => {
      const { amount, recipient, memo, feeRate } = arg;
      const address = get(currentAccountStxAddressState);
      if (!address) return;
      const { network, account, nonce } = await get(
        waitForAll({
          network: currentStacksNetworkState,
          account: currentAccountState,
          nonce: currentAccountNonceState,
        }),
        true
      );

      if (!account || typeof nonce === 'undefined') return;

      const txOptions = {
        recipient,
        amount: new BN(stxToMicroStx(amount).toString(), 10),
        memo,
        senderKey: account.stxPrivateKey,
        network: network,
        nonce: new BN(nonce.toString(), 10),
        anchorMode: AnchorMode.Any,
      };

      return makeSTXTokenTransfer(txOptions).then(transaction =>
        updateTransactionFee(transaction, feeRate)
      );
    }, [])
  );
}

export function useTransactionBroadcast() {
  const { doSetLatestNonce } = useWallet();
  return useAtomCallback(
    useCallback(
      async (get, set) => {
        const { account, signedTransaction, attachment, requestToken, network } = await get(
          waitForAll({
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
          typeof nonce !== 'undefined' && (await doSetLatestNonce(nonce));
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
      [doSetLatestNonce]
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
