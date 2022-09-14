import { useCallback, useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { atom } from 'jotai';
import { useAtomValue, waitForAll } from 'jotai/utils';
import { TransactionTypes } from '@stacks/connect';
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

import { AssetWithMeta } from '@app/common/asset-types';
import { ftUnshiftDecimals, stxToMicroStx } from '@app/common/stacks-utils';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { makePostCondition } from '@app/store/transactions/transaction.hooks';
import { useNextNonce } from '@app/query/nonce/account-nonces.hooks';
import { currentStacksNetworkState } from '@app/store/network/networks';
import {
  generateUnsignedTransaction,
  GenerateUnsignedTransactionOptions,
} from '@app/common/transactions/generate-unsigned-txs';

import { useSelectedAssetMetadata } from '../assets/asset.hooks';
import { useCurrentAccount } from '../accounts/account.hooks';

function useMakeFungibleTokenTransfer(asset: AssetWithMeta) {
  const currentAccount = useCurrentAccount();
  const network = useAtomValue(currentStacksNetworkState);

  return useMemo(() => {
    if (asset && currentAccount && currentAccount.address) {
      const { contractName, contractAddress, name: assetName } = asset;
      return {
        asset,
        stxAddress: currentAccount.address,
        network,
        assetName,
        contractAddress,
        contractName,
      };
    }
    return;
  }, [asset, currentAccount, network]);
}

const stxTokenTransferAtomDeps = atom(get =>
  get(waitForAll({ network: currentStacksNetworkState }))
);

export function useGenerateStxTokenTransferUnsignedTx() {
  const { nonce } = useNextNonce();
  const { network } = useAtomValue(stxTokenTransferAtomDeps);
  const account = useCurrentAccount();

  return useCallback(
    async (values?: TransactionFormValues) => {
      if (!account) return;

      const options: GenerateUnsignedTransactionOptions = {
        publicKey: account.stxPublicKey,
        nonce: Number(values?.nonce) || nonce,
        fee: stxToMicroStx(values?.fee || 0).toNumber(),
        txData: {
          txType: TransactionTypes.STXTransfer,
          // Using account address here as a fallback for a fee estimation
          recipient: values?.recipient || account.address,
          amount: values?.amount ? stxToMicroStx(values?.amount).toString(10) : '0',
          memo: values?.memo || undefined,
          network: network,
          // Coercing type here as we don't have the public key
          // as expected by STXTransferPayload type.
          // This code will likely need to change soon with Ledger
          // work, and coercion allows us to remove lots of type mangling
          // and types are out of sync with @stacks/connect
        } as any,
      };
      return generateUnsignedTransaction(options);
    },
    [network, account, nonce]
  );
}

export function useStxTokenTransferUnsignedTxState(values?: TransactionFormValues) {
  const generateTx = useGenerateStxTokenTransferUnsignedTx();
  const { nonce } = useNextNonce();
  const { network } = useAtomValue(stxTokenTransferAtomDeps);
  const account = useCurrentAccount();

  const tx = useAsync(
    async () => generateTx(values ?? undefined),
    [values, network, account, nonce]
  );

  return tx.result;
}

export function useGenerateFtTokenTransferUnsignedTx(selectedAssetId: string) {
  const { nonce } = useNextNonce();
  const account = useCurrentAccount();
  const selectedAsset = useSelectedAssetMetadata(selectedAssetId);
  const assetTransferState = useMakeFungibleTokenTransfer(selectedAsset);

  return useCallback(
    async (values?: TransactionFormValues) => {
      if (!assetTransferState || !selectedAsset || !account) return;

      const { asset, network, assetName, contractAddress, contractName, stxAddress } =
        assetTransferState;

      const functionName = 'transfer';

      const realAmount =
        asset.type === 'ft'
          ? ftUnshiftDecimals(values?.amount || 0, asset?.meta?.decimals || 0)
          : values?.amount || 0;

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
          values ? createAddress(values?.recipient || '') : createEmptyAddress()
        ),
      ];

      if (asset.hasMemo) {
        functionArgs.push(
          values?.memo !== '' ? someCV(bufferCVFromString(values?.memo || '')) : noneCV()
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
        fee: stxToMicroStx(values?.fee || 0).toNumber(),
        publicKey: account.stxPublicKey,
        nonce: Number(values?.nonce) ?? nonce,
      } as const;

      return generateUnsignedTransaction(options);
    },
    [account, assetTransferState, nonce, selectedAsset]
  );
}

export function useFtTokenTransferUnsignedTx(
  selectedAssetId: string,
  values?: TransactionFormValues
) {
  const generateTx = useGenerateFtTokenTransferUnsignedTx(selectedAssetId);
  const account = useCurrentAccount();
  const selectedAsset = useSelectedAssetMetadata(selectedAssetId);
  const assetTransferState = useMakeFungibleTokenTransfer(selectedAsset);

  const tx = useAsync(
    async () => generateTx(values ?? undefined),
    [account, assetTransferState, selectedAsset, values]
  );

  return tx.result;
}
