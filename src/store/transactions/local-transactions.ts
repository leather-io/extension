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
  serializeCV,
  someCV,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';

import { ftUnshiftDecimals, stxToMicroStx } from '@common/stacks-utils';
import { TransactionFormValues } from '@common/transactions/transaction-utils';
import {
  generateSignedTransaction,
  GenerateSignedTransactionOptions,
} from '@common/transactions/generate-signed-txs';
import { makeFungibleTokenTransferState } from '@store/transactions/fungible-token-transfer';
import { selectedAssetStore } from '@store/assets/asset-search';
import { makePostCondition } from '@store/transactions/transaction.hooks';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { currentStacksNetworkState } from '@store/network/networks';
import { currentAccountNonceState } from '@store/accounts/nonce';
import { customNonceState } from '@store/transactions/nonce.hooks';

// This is the form state so can likely be removed from global store when we
// refactor transaction signing. Leaving for now to avoid conflicts but deprecating.
/** @deprecated */
export const localStacksTransactionInputsState = atom<TransactionFormValues | null>(null);

const stxTokenTransferTransactionState = atom(get => {
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
  const senderKey = account.stxPrivateKey;
  const txNonce = typeof customNonce === 'number' ? customNonce : nonce;
  const options: GenerateSignedTransactionOptions = {
    senderKey,
    nonce: txNonce,
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

  return generateSignedTransaction(options).then(transaction => {
    if (!transaction) return;
    return generateSignedTransaction({
      ...options,
      fee: stxToMicroStx(txData?.fee || 0).toNumber(),
    });
  });
});

const ftTokenTransferTransactionState = atom(get => {
  const txData = get(localStacksTransactionInputsState);
  const address = get(currentAccountStxAddressState);
  const customNonce = get(customNonceState);

  if (!address) return;

  const account = get(currentAccountState);
  const assetTransferState = get(makeFungibleTokenTransferState);
  const selectedAsset = get(selectedAssetStore);

  if (!assetTransferState || !selectedAsset || !account) return;
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
      // Dummy public key to satisfy types
      // This isn't a good parttern to follow, but much of this
      // code will have to change with Ledger code anyway
      publicKey: '',
    },
    senderKey,
    nonce: txNonce,
  } as const;

  return generateSignedTransaction(options).then(transaction => {
    if (!transaction) return;
    return generateSignedTransaction({
      ...options,
      fee: stxToMicroStx(txData?.fee || 0).toNumber(),
    });
  });
});

const localTransactionIsStxTransferState = atom(get => {
  const selectedAsset = get(selectedAssetStore);
  return selectedAsset?.type === 'stx';
});

export const localTransactionState = atom(get => {
  return get(localTransactionIsStxTransferState)
    ? get(stxTokenTransferTransactionState)
    : get(ftTokenTransferTransactionState);
});
