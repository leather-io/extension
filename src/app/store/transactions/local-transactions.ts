import { useCallback } from 'react';
import { atom } from 'jotai';
import { useAtomValue, waitForAll } from 'jotai/utils';
import { TransactionTypes } from '@stacks/connect';
import { useAsync } from 'react-async-hook';
import {
  bufferCVFromString,
  ClarityValue,
  createAddress,
  createEmptyAddress,
  noneCV,
  PostConditionMode,
  serializeCV,
  someCV,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';

import { ftUnshiftDecimals, stxToMicroStx } from '@app/common/stacks-utils';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { makePostCondition } from '@app/store/transactions/transaction.hooks';
import { currentAccountState, currentAccountStxAddressState } from '@app/store/accounts';
import { currentStacksNetworkState } from '@app/store/network/networks';
import { currentAccountNonceState } from '@app/store/accounts/nonce';
import { customNonceState } from '@app/store/transactions/nonce.hooks';
import {
  generateUnsignedTransaction,
  GenerateUnsignedTransactionOptions,
} from '@app/common/transactions/generate-unsigned-txs';
import { useMakeFungibleTokenTransfer } from './fungible-token-transfer';
import { useSelectedAssetItem } from '../assets/asset.hooks';

// This is the form state so can likely be removed from global store when we
// refactor transaction signing. Leaving for now to avoid conflicts but deprecating.
/** @deprecated */
export const localStacksTransactionInputsState = atom<TransactionFormValues | null>(null);

const stxTokenTransferAtomDeps = atom(get =>
  get(
    waitForAll({
      network: currentStacksNetworkState,
      account: currentAccountState,
      nonce: currentAccountNonceState,
    })
  )
);

export function useGenerateStxTokenTransferUnsignedTx() {
  const address = useAtomValue(currentAccountStxAddressState);
  const customNonce = useAtomValue(customNonceState);
  const { network, account, nonce } = useAtomValue(stxTokenTransferAtomDeps);

  return useCallback(
    async (txData?: TransactionFormValues) => {
      if (!address) return;
      if (!account || typeof nonce === 'undefined') return;
      const txNonce = typeof customNonce === 'number' ? customNonce : nonce;
      // console.log({ address, account, nonce });
      const options: GenerateUnsignedTransactionOptions = {
        publicKey: account.stxPublicKey,
        nonce: txNonce,
        fee: stxToMicroStx(txData?.fee || 0).toNumber(),
        txData: {
          txType: TransactionTypes.STXTransfer,
          // Using account address here as a fallback for a fee estimation
          recipient: txData?.recipient || account.address,
          amount: txData?.amount ? stxToMicroStx(txData?.amount).toString(10) : '0',
          memo: txData?.memo || undefined,
          network: network,
          // Coercing type here as we don't have the public key
          // as expected by STXTransferPayload type.
          // This code will likely need to change soon with Ledger
          // work, and concersion allows us to remove lots of type mangling
          // and types are out of sync with @stacks/connect
        } as any,
      };
      return generateUnsignedTransaction(options);
    },
    [address, customNonce, network, account, nonce]
  );
}

export function useStxTokenTransferUnsignedTxState() {
  const generateTx = useGenerateStxTokenTransferUnsignedTx();

  const txData = useAtomValue(localStacksTransactionInputsState);
  const address = useAtomValue(currentAccountStxAddressState);
  const customNonce = useAtomValue(customNonceState);
  const { network, account, nonce } = useAtomValue(stxTokenTransferAtomDeps);

  const tx = useAsync(async () => {
    return generateTx(txData ?? undefined);
  }, [txData, address, customNonce, network, account, nonce]);

  return tx.result;
}

export function useGenerateFtTokenTransferUnsignedTx() {
  const address = useAtomValue(currentAccountStxAddressState);
  const customNonce = useAtomValue(customNonceState);

  const account = useAtomValue(currentAccountState);
  const assetTransferState = useMakeFungibleTokenTransfer();
  const selectedAsset = useSelectedAssetItem();

  return useCallback(
    async (txData?: TransactionFormValues) => {
      if (!address || !assetTransferState || !selectedAsset || !account) return;

      const { network, assetName, contractAddress, contractName, nonce, stxAddress } =
        assetTransferState;

      const functionName = 'transfer';

      const txNonce = typeof customNonce === 'number' ? customNonce : nonce;

      const realAmount =
        selectedAsset.type === 'ft'
          ? ftUnshiftDecimals(txData?.amount || 0, selectedAsset?.meta?.decimals || 0)
          : txData?.amount || 0;

      const postConditionOptions = {
        contractAddress,
        contractName,
        assetName,
        stxAddress,
        amount: realAmount,
      };

      const postConditions = [makePostCondition(postConditionOptions)];

      // (transfer (uint principal principal) (response bool uint))
      const functionArgs: ClarityValue[] = [
        uintCV(realAmount),
        standardPrincipalCVFromAddress(createAddress(stxAddress)),
        standardPrincipalCVFromAddress(
          txData ? createAddress(txData?.recipient || '') : createEmptyAddress()
        ),
      ];

      if (selectedAsset.hasMemo) {
        functionArgs.push(
          txData?.memo !== '' ? someCV(bufferCVFromString(txData?.memo || '')) : noneCV()
        );
      }

      const options = {
        txData: {
          txType: TransactionTypes.ContractCall,
          contractAddress,
          contractName,
          functionName,
          functionArgs: functionArgs.map(serializeCV).map(arg => arg.toString('hex')),
          postConditions,
          postConditionMode: PostConditionMode.Deny,
          network,
          publicKey: account.stxPublicKey,
        },
        fee: stxToMicroStx(txData?.fee || 0).toNumber(),
        publicKey: account.stxPublicKey,
        nonce: txNonce,
      } as const;

      return generateUnsignedTransaction(options);
    },
    [address, customNonce, account, assetTransferState, selectedAsset]
  );
}

export function useFtTokenTransferUnsignedTx() {
  const generateTx = useGenerateFtTokenTransferUnsignedTx();
  const txData = useAtomValue(localStacksTransactionInputsState);
  const address = useAtomValue(currentAccountStxAddressState);
  const customNonce = useAtomValue(customNonceState);

  const account = useAtomValue(currentAccountState);
  const assetTransferState = useMakeFungibleTokenTransfer();
  const selectedAsset = useSelectedAssetItem();

  return useAsync(
    async () => generateTx(txData ?? undefined),
    [txData, address, customNonce, account, assetTransferState, selectedAsset]
  ).result;
}
