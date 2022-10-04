import { useCallback, useMemo } from 'react';
import { useAsync } from 'react-async-hook';
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
import { SendFormValues, TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { makePostCondition } from '@app/store/transactions/transaction.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import {
  generateUnsignedTransaction,
  GenerateUnsignedTransactionOptions,
} from '@app/common/transactions/generate-unsigned-txs';

import { useSelectedAssetMetadata } from '../assets/asset.hooks';
import { useCurrentAccount } from '../accounts/account.hooks';
import { bytesToHex } from '@stacks/common';

function useMakeFungibleTokenTransfer(asset: AssetWithMeta) {
  const currentAccount = useCurrentAccount();
  const network = useCurrentStacksNetworkState();

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

export function useGenerateStxTokenTransferUnsignedTx() {
  const { nonce } = useNextNonce();
  const network = useCurrentStacksNetworkState();
  const account = useCurrentAccount();

  return useCallback(
    async (values?: SendFormValues) => {
      if (!account) return;

      const options: GenerateUnsignedTransactionOptions = {
        publicKey: account.stxPublicKey,
        nonce: Number(values?.nonce) ?? nonce,
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

export function useStxTokenTransferUnsignedTxState(values?: SendFormValues) {
  const generateTx = useGenerateStxTokenTransferUnsignedTx();
  const { nonce } = useNextNonce();
  const network = useCurrentStacksNetworkState();
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
    async (values?: SendFormValues | TransactionFormValues) => {
      if (!assetTransferState || !selectedAsset || !account) return;

      const { asset, network, assetName, contractAddress, contractName, stxAddress } =
        assetTransferState;

      const functionName = 'transfer';

      const recipient =
        values && 'recipient' in values
          ? createAddress(values.recipient || '')
          : createEmptyAddress();
      const amount = values && 'amount' in values ? values.amount : 0;
      const memo =
        values && 'memo' in values && values.memo !== ''
          ? someCV(bufferCVFromString(values.memo || ''))
          : noneCV();

      const realAmount =
        asset.type === 'ft' ? ftUnshiftDecimals(amount, asset?.meta?.decimals || 0) : amount;

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
        standardPrincipalCVFromAddress(recipient),
      ];

      if (asset.hasMemo) {
        functionArgs.push(memo);
      }

      const options = {
        txData: {
          txType: TransactionTypes.ContractCall,
          contractAddress,
          contractName,
          functionName,
          functionArgs: functionArgs.map(serializeCV).map(arg => bytesToHex(arg)),
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

export function useFtTokenTransferUnsignedTx(selectedAssetId: string, values?: SendFormValues) {
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
