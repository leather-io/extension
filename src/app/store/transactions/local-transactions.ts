import { atom } from 'jotai';
import { waitForAll } from 'jotai/utils';
import { STXTransferPayload, TransactionTypes } from '@stacks/connect';
import {
  bufferCVFromString,
  ClarityValue,
  createAddress,
  createEmptyAddress,
  noneCV,
  PostConditionMode,
  pubKeyfromPrivKey,
  publicKeyToString,
  serializeCV,
  someCV,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';

import { ftUnshiftDecimals, stxToMicroStx } from '@app/common/stacks-utils';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { makeFungibleTokenTransferState } from '@app/store/transactions/fungible-token-transfer';
import { selectedAssetStore } from '@app/store/assets/asset-search';
import { makePostCondition } from '@app/store/transactions/transaction.hooks';
import { currentAccountState, currentAccountStxAddressState } from '@app/store/accounts';
import { currentStacksNetworkState } from '@app/store/network/networks';
import { currentAccountNonceState } from '@app/store/accounts/nonce';
import { customNonceState } from '@app/store/transactions/nonce.hooks';
import {
  generateUnsignedTransaction,
  GenerateUnsignedTransactionOptions,
} from '@app/common/transactions/generate-unsigned-txs';

// This is the form state so can likely be removed from global store when we
// refactor transaction signing. Leaving for now to avoid conflicts but deprecating.
/** @deprecated */
export const localStacksTransactionInputsState = atom<TransactionFormValues | null>(null);

const stxTokenTransferUnsignedTxState = atom(get => {
  const txData = get(localStacksTransactionInputsState);
  const address = get(currentAccountStxAddressState);
  const customNonce = get(customNonceState);

  if (!address) return;
  const { network, account, nonce } = get(
    waitForAll({
      network: currentStacksNetworkState,
      account: currentAccountState,
      nonce: currentAccountNonceState,
    })
  );

  if (!account || typeof nonce === 'undefined') return;
  const txNonce = typeof customNonce === 'number' ? customNonce : nonce;
  const options: GenerateUnsignedTransactionOptions = {
    publicKey: publicKeyToString(pubKeyfromPrivKey(account.stxPrivateKey)),
    nonce: txNonce,
    fee: stxToMicroStx(txData?.fee || 0).toNumber(),
    txData: {
      txType: TransactionTypes.STXTransfer,
      // Using account address here as a fallback for a fee estimation
      recipient: txData?.recipient || account.address,
      amount: txData?.amount ? stxToMicroStx(txData.amount).toString(10) : '0',
      memo: txData?.memo || undefined,
      network,
      // Coercing type here as we don't have the public key
      // as expected by STXTransferPayload type.
      // This code will likely need to change soon with Ledger
      // work, and concersion allows us to remove lots of type mangling
    } as STXTransferPayload,
  };

  return generateUnsignedTransaction(options);
});

const ftTokenTransferUnsignedTxState = atom(get => {
  const txData = get(localStacksTransactionInputsState);
  const address = get(currentAccountStxAddressState);
  const customNonce = get(customNonceState);

  if (!address) return;

  const account = get(currentAccountState);
  const assetTransferState = get(makeFungibleTokenTransferState);
  const selectedAsset = get(selectedAssetStore);

  if (!assetTransferState || !selectedAsset || !account) return;
  const { balances, network, assetName, contractAddress, contractName, nonce, stxAddress } =
    assetTransferState;

  const functionName = 'transfer';

  const txNonce = typeof customNonce === 'number' ? customNonce : nonce;

  const tokenBalanceKey = Object.keys(balances?.fungible_tokens || {}).find(contract => {
    return contract.startsWith(contractAddress);
  });

  const realAmount =
    selectedAsset.type === 'ft'
      ? ftUnshiftDecimals(txData?.amount || 0, selectedAsset?.meta?.decimals || 0)
      : txData?.amount || 0;

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
      publicKey: publicKeyToString(pubKeyfromPrivKey(account.stxPrivateKey)),
    },
    fee: stxToMicroStx(txData?.fee || 0).toNumber(),
    publicKey: publicKeyToString(pubKeyfromPrivKey(account.stxPrivateKey)),
    nonce: txNonce,
  } as const;

  return generateUnsignedTransaction(options);
});

const isSendFormSendingStx = atom(get => {
  const selectedAsset = get(selectedAssetStore);
  return selectedAsset?.type === 'stx';
});

export const sendFormUnsignedTxState = atom(get => {
  return get(isSendFormSendingStx)
    ? get(stxTokenTransferUnsignedTxState)
    : get(ftTokenTransferUnsignedTxState);
});
