import { atom } from 'jotai';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { waitForAll } from 'jotai/utils';
import { currentStacksNetworkState } from '@store/network/networks';
import { currentAccountNonceState } from '@store/accounts/nonce';

import { customNonceState } from '@store/transactions/nonce.hooks';
import { ftUnshiftDecimals, stxToMicroStx } from '@common/stacks-utils';
import {
  bufferCVFromString,
  ClarityValue,
  createAddress,
  noneCV,
  PostConditionMode,
  serializeCV,
  someCV,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';
import { calculateFeeFromFeeRate } from '@store/transactions/utils';
import { makeFungibleTokenTransferState } from '@store/transactions/fungible-token-transfer';
import { selectedAssetStore } from '@store/assets/asset-search';
import { makePostCondition } from '@store/transactions/transaction.hooks';
import {
  generateSignedTransaction,
  GenerateSignedTransactionOptions,
} from '@common/transactions/transactions';
import { STXTransferPayload, TransactionTypes } from '@stacks/connect';
import { customAbsoluteTxFee, feeRateState } from './fees';

export const localStacksTransactionInputsState = atom<{
  amount: number;
  memo: string;
  recipient: string;
} | null>(null);

const tokenTransferTransaction = atom(get => {
  const txData = get(localStacksTransactionInputsState);
  const address = get(currentAccountStxAddressState);
  const customNonce = get(customNonceState);
  const customAbsoluteFee = get(customAbsoluteTxFee);

  if (!address || !txData) return;
  const { amount, recipient, memo } = txData;
  const { network, account, nonce, feeRate } = get(
    waitForAll({
      network: currentStacksNetworkState,
      account: currentAccountState,
      nonce: currentAccountNonceState,
      feeRate: feeRateState,
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
      recipient,
      amount: stxToMicroStx(amount).toString(10),
      memo,
      network,
      // Coercing type here as we don't have the public key
      // as expected by STXTransferPayload type.
      // This code will likely need to change soon with Ledger
      // work, and concersion allows us to remove lots of type mangling
    } as STXTransferPayload,
  };

  return generateSignedTransaction(options).then(transaction => {
    const fee = customAbsoluteFee || calculateFeeFromFeeRate(transaction, feeRate).toNumber();
    return generateSignedTransaction({ ...options, fee });
  });
});

const ftTokenTransferTransactionState = atom(get => {
  const txData = get(localStacksTransactionInputsState);
  const address = get(currentAccountStxAddressState);
  const customNonce = get(customNonceState);
  if (!address || !txData) return;
  const { amount, recipient, memo } = txData;
  const assetTransferState = get(makeFungibleTokenTransferState);
  const selectedAsset = get(selectedAssetStore);
  const feeRate = get(feeRateState);
  const customFee = get(customAbsoluteTxFee);

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

  const txNonce = typeof customNonce === 'number' ? customNonce : nonce;

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
      // This isn't a good partern to follow, but much of this
      // code will have to change with Ledger code anyway
      publicKey: '',
    },
    senderKey,
    nonce: txNonce,
  } as const;

  return generateSignedTransaction(options).then(transaction => {
    if (!transaction) return;
    const fee = customFee || calculateFeeFromFeeRate(transaction, feeRate).toNumber();
    return generateSignedTransaction({ ...options, fee });
  });
});

export const localStxTransactionAmountState = atom<null | number>(null);

const localTransactionIsStxTransferState = atom(get => {
  const selectedAsset = get(selectedAssetStore);
  return selectedAsset?.type === 'stx';
});

export const localTransactionState = atom(get => {
  return get(localTransactionIsStxTransferState)
    ? get(tokenTransferTransaction)
    : get(ftTokenTransferTransactionState);
});
