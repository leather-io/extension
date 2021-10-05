import { useCallback } from 'react';
import BN from 'bn.js';
import { useAtomCallback, useAtomValue, waitForAll } from 'jotai/utils';
import {
  AnchorMode,
  bufferCVFromString,
  ClarityValue,
  createAddress,
  createAssetInfo,
  FungibleConditionCode,
  makeContractCall,
  makeStandardFungiblePostCondition,
  makeSTXTokenTransfer,
  noneCV,
  PostCondition,
  someCV,
  StacksTransaction,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';

import { ftUnshiftDecimals, stxToMicroStx } from '@common/stacks-utils';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { currentAccountNonceState } from '@store/accounts/nonce';
import { currentNetworkState, currentStacksNetworkState } from '@store/network/networks';
import {
  pendingTransactionState,
  signedTransactionState,
  transactionAttachmentState,
  transactionBroadcastErrorState,
  txByteSize,
  txForSettingsState,
} from './index';
import {
  transactionContractInterfaceState,
  transactionContractSourceState,
  transactionFunctionsState,
} from './contract-call';
import { postConditionsState } from './post-conditions';
import { useWallet } from '@common/hooks/use-wallet';
import { requestTokenState } from './requests';
import { handleBroadcastTransaction } from '@common/transactions/transactions';
import { makeFungibleTokenTransferState } from './fungible-token-transfer';
import { selectedAssetStore } from '@store/assets/asset-search';
import { updateTransactionFee } from '@store/transactions/utils';
import { useAtom } from 'jotai';
import {
  localStacksTransactionInputsState,
  localTransactionState,
} from '@store/transactions/local-transactions';
import { currentAccountLocallySubmittedTxsState } from '@store/accounts/account-activity';
import { todaysIsoDate } from '@common/date-utils';
import { finalizeTxSignature } from '@common/actions/finalize-tx-signature';

export function usePendingTransaction() {
  return useAtomValue(pendingTransactionState);
}

export function useTransactionContractInterface() {
  return useAtomValue(transactionContractInterfaceState);
}

export function useTransactionContractSource() {
  return useAtomValue(transactionContractSourceState);
}

export function useTransactionFunction() {
  return useAtomValue(transactionFunctionsState);
}

export function useTransactionPostConditions() {
  return useAtomValue(postConditionsState);
}

export function useSignedTransaction() {
  return useAtomValue(signedTransactionState);
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
        network: network as any,
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
          const result = await handleBroadcastTransaction({
            isSponsored,
            serialized,
            txRaw,
            attachment,
            networkUrl: network.url,
          });
          typeof nonce !== 'undefined' && (await doSetLatestNonce(nonce));
          finalizeTxSignature(requestToken, result);
          if (result.txId)
            set(currentAccountLocallySubmittedTxsState, {
              [result.txId]: {
                rawTx: result.txRaw,
                timestamp: todaysIsoDate(),
              },
            });
        } catch (error) {
          console.error(error);
          set(transactionBroadcastErrorState, error.message);
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

interface AssetTransferOptions {
  amount: number;
  recipient: string;
  memo: string;
  feeRate: number;
}

export function useMakeAssetTransfer() {
  return useAtomCallback<StacksTransaction | undefined, AssetTransferOptions>(
    useCallback(async (get, _set, arg) => {
      const { amount, recipient, memo, feeRate } = arg;
      // unstable_async option @see https://github.com/pmndrs/jotai/blob/master/src/core/atom.ts#L8
      // allows you to await a get
      const assetTransferState = await get(makeFungibleTokenTransferState, true);
      const selectedAsset = get(selectedAssetStore);
      if (!assetTransferState || !selectedAsset) return;
      const {
        balances,
        network,
        senderKey,
        assetName,
        contractAddress,
        contractName,
        nonce,
        stxAddress,
      } = assetTransferState;

      const functionName = 'transfer';

      const tokenBalanceKey = Object.keys(balances?.fungible_tokens || {}).find(contract => {
        return contract.startsWith(contractAddress);
      });

      const realAmount =
        selectedAsset.type === 'ft'
          ? ftUnshiftDecimals(amount, selectedAsset?.meta?.decimals || 0)
          : amount;

      const postConditionOptions = tokenBalanceKey
        ? {
            contractAddress,
            contractName,
            assetName,
            stxAddress,
            amount: realAmount,
          }
        : undefined;

      const postConditions = postConditionOptions ? [makePostCondition(postConditionOptions)] : [];

      // (transfer (uint principal principal) (response bool uint))
      const functionArgs: ClarityValue[] = [
        uintCV(realAmount),
        standardPrincipalCVFromAddress(createAddress(stxAddress)),
        standardPrincipalCVFromAddress(createAddress(recipient)),
      ];

      if (selectedAsset.hasMemo) {
        functionArgs.push(memo !== '' ? someCV(bufferCVFromString(memo)) : noneCV());
      }
      const txOptions = {
        network,
        functionName,
        functionArgs,
        senderKey,
        contractAddress,
        contractName,
        postConditions,
        nonce: new BN(nonce, 10),
        anchorMode: AnchorMode.Any,
      };

      return makeContractCall(txOptions as any).then(transaction =>
        updateTransactionFee(transaction, feeRate)
      );
    }, [])
  );
}

export const useLocalTransactionInputsState = () => useAtom(localStacksTransactionInputsState);
export const useLocalTransactionState = () => useAtom(localTransactionState);
export const useTxForSettingsState = () => useAtom(txForSettingsState);
export const useTxByteSizeState = () => useAtom(txByteSize);
