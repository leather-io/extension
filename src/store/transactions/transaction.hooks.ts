import { useCallback } from 'react';
import BN from 'bn.js';
import { useAtom } from 'jotai';
import { useAtomCallback, useAtomValue, waitForAll } from 'jotai/utils';
import {
  createAssetInfo,
  createStacksPrivateKey,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  PostCondition,
  StacksTransaction,
  TransactionSigner,
} from '@stacks/transactions';

import { todaysIsoDate } from '@common/date-utils';
import { finalizeTxSignature } from '@common/actions/finalize-tx-signature';
import { useWallet } from '@common/hooks/use-wallet';
import { broadcastTransaction } from '@common/transactions/broadcast-transaction';
import { currentAccountState } from '@store/accounts';
import { currentNetworkState } from '@store/network/networks';
import {
  localStacksTransactionInputsState,
  sendFormUnsignedTxState,
} from '@store/transactions/local-transactions';
import { currentAccountLocallySubmittedTxsState } from '@store/accounts/account-activity';

import { postConditionsState } from './post-conditions';
import { requestTokenState } from './requests';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import {
  estimatedTransactionByteLengthState,
  estimatedUnsignedTransactionByteLengthState,
  prepareTxDetailsForBroadcast,
  pendingTransactionState,
  serializedTransactionPayloadState,
  serializedUnsignedTransactionPayloadState,
  transactionAttachmentState,
  transactionBroadcastErrorState,
  txByteSize,
  txForSettingsState,
  unsignedStacksTransactionState,
  unsignedTransactionState,
} from './index';

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

export function useSignTransactionSoftwareWallet() {
  const account = useCurrentAccount();
  if (!account) throw new Error('Cannot sign a transaction without an account');
  return useCallback(
    (tx: StacksTransaction) => {
      const signer = new TransactionSigner(tx);
      signer.signOrigin(createStacksPrivateKey(account.stxPrivateKey));
      return tx;
    },
    [account.stxPrivateKey]
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
          true
        );

        if (!account || !requestToken || !unsignedStacksTransaction) {
          set(transactionBroadcastErrorState, 'No pending transaction found.');
          return;
        }

        try {
          const signedTx = signSoftwareWalletTx(unsignedStacksTransaction);
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

export function useLocalTransactionInputsState() {
  return useAtom(localStacksTransactionInputsState);
}

export function useSendFormUnsignedTxState() {
  return useAtomValue(sendFormUnsignedTxState);
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
  return useAtom(txForSettingsState);
}

export function useTxByteSizeState() {
  return useAtom(txByteSize);
}
