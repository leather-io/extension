import { useCallback, useMemo } from 'react';
import { useAsync } from 'react-async-hook';

import { bytesToHex } from '@stacks/common';
import { TransactionTypes } from '@stacks/connect';
import {
  ClarityValue,
  PostConditionMode,
  bufferCVFromString,
  createAddress,
  createEmptyAddress,
  noneCV,
  serializeCV,
  someCV,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';
import type { SendFormValues, TransactionFormValues } from '@shared/models/form.model';

import { stxToMicroStx } from '@app/common/money/unit-conversion';
import { ftUnshiftDecimals } from '@app/common/stacks-utils';
import {
  GenerateUnsignedTransactionOptions,
  generateUnsignedTransaction,
} from '@app/common/transactions/stacks/generate-unsigned-txs';
import { useStacksCryptoAssetBalanceByAssetId } from '@app/query/stacks/balance/crypto-asset-balances.hooks';
import { getStacksFungibleTokenCurrencyAssetBalance } from '@app/query/stacks/balance/crypto-asset-balances.utils';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';
import { makePostCondition } from '@app/store/transactions/transaction.hooks';

import { useCurrentAccount } from '../accounts/account.hooks';

function useMakeFungibleTokenTransfer(assetBalance?: StacksFungibleTokenAssetBalance) {
  const currentAccount = useCurrentAccount();
  const network = useCurrentStacksNetworkState();

  return useMemo(() => {
    if (assetBalance && currentAccount && currentAccount.address) {
      const { contractAddress, contractAssetName, contractName } = assetBalance.asset;
      return {
        assetBalance,
        contractAssetName,
        contractAddress,
        contractName,
        network,
        stxAddress: currentAccount.address,
      };
    }
    return;
  }, [assetBalance, currentAccount, network]);
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
  const selectedAssetBalance = useStacksCryptoAssetBalanceByAssetId(selectedAssetId);
  const tokenCurrencyAssetBalance =
    getStacksFungibleTokenCurrencyAssetBalance(selectedAssetBalance);
  const assetTransferState = useMakeFungibleTokenTransfer(tokenCurrencyAssetBalance);

  return useCallback(
    async (values?: SendFormValues | TransactionFormValues) => {
      if (!assetTransferState || !account) return;

      const {
        assetBalance,
        network,
        contractAddress,
        contractAssetName,
        contractName,
        stxAddress,
      } = assetTransferState;

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
        assetBalance.type === 'fungible-token'
          ? ftUnshiftDecimals(amount, assetBalance.asset.decimals || 0)
          : amount;

      const postConditionOptions = {
        amount: realAmount,
        contractAddress,
        contractAssetName,
        contractName,
        stxAddress,
      };

      const postConditions = [makePostCondition(postConditionOptions)];

      // (transfer (uint principal principal) (response bool uint))
      const functionArgs: ClarityValue[] = [
        uintCV(realAmount),
        standardPrincipalCVFromAddress(createAddress(stxAddress)),
        standardPrincipalCVFromAddress(recipient),
      ];

      if (assetBalance.asset.hasMemo) {
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
    [account, assetTransferState, nonce]
  );
}

// TODO: Refactor when remove legacy send form?
export function useFtTokenTransferUnsignedTx(selectedAssetId: string, values?: SendFormValues) {
  const generateTx = useGenerateFtTokenTransferUnsignedTx(selectedAssetId);
  const account = useCurrentAccount();
  const selectedAssetBalance = useStacksCryptoAssetBalanceByAssetId(selectedAssetId);
  const tokenCurrencyAssetBalance =
    getStacksFungibleTokenCurrencyAssetBalance(selectedAssetBalance);
  const assetTransferState = useMakeFungibleTokenTransfer(tokenCurrencyAssetBalance);

  const tx = useAsync(
    async () => generateTx(values ?? undefined),
    [account, assetTransferState, selectedAssetBalance, values]
  );

  return tx.result;
}
