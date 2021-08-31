import { atom } from 'jotai';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { waitForAll } from 'jotai/utils';
import { currentStacksNetworkState } from '@store/network/networks';
import { currentAccountNonceState } from '@store/accounts/nonce';
import { currentFeeRateState } from '@store/transactions/fees';
import BN from 'bn.js';
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
import { getUpdatedTransactionFee } from '@store/transactions/utils';
import { makeFungibleTokenTransferState } from '@store/transactions/fungible-token-transfer';
import { selectedAssetStore } from '@store/assets/asset-search';
import { makePostCondition } from '@store/transactions/transaction.hooks';
import { generateSignedTransaction } from '@common/transactions/transactions';
import { TransactionTypes } from '@stacks/connect';

export const localStacksTransactionInputsState = atom<{
  amount: number;
  memo: string;
  recipient: string;
} | null>(null);

export const tokenTransferTransaction = atom(async get => {
  const txData = get(localStacksTransactionInputsState);
  const address = get(currentAccountStxAddressState);
  if (!address || !txData) return;
  const { amount, recipient, memo } = txData;
  const { network, account, nonce, feeRate } = get(
    waitForAll({
      network: currentStacksNetworkState,
      account: currentAccountState,
      nonce: currentAccountNonceState,
      feeRate: currentFeeRateState,
    })
  );

  if (!account || typeof nonce === 'undefined') return;
  const senderKey = account.stxPrivateKey;

  const options = {
    senderKey,
    nonce,
    txData: {
      txType: TransactionTypes.STXTransfer,
      recipient,
      amount: stxToMicroStx(amount).toString(10),
      memo,
      network: network as any,
    },
  };
  const transaction = await generateSignedTransaction(
    options as any
    // @TODO: kyran pls fix types
  );
  if (!transaction) return;
  const fee = getUpdatedTransactionFee(transaction, feeRate);
  return generateSignedTransaction({ ...options, fee: fee.toNumber() } as any);
});

export const ftTokenTransferTransactionState = atom(async get => {
  const txData = get(localStacksTransactionInputsState);
  const address = get(currentAccountStxAddressState);
  if (!address || !txData) return;
  const { amount, recipient, memo } = txData;
  const assetTransferState = get(makeFungibleTokenTransferState);
  const selectedAsset = get(selectedAssetStore);
  const feeRate = get(currentFeeRateState);
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
  const options = {
    txData: {
      txType: TransactionTypes.ContractCall,
      contractAddress,
      contractName,
      functionName,
      functionArgs: functionArgs.map(serializeCV),
      postConditions,
      postConditionMode: PostConditionMode.Deny,
      network: network as any,
    },
    senderKey,
    nonce: new BN(nonce, 10),
  };

  const transaction = await generateSignedTransaction(
    options as any
    // @TODO: kyran pls fix types
  );
  if (!transaction) return;
  const fee = getUpdatedTransactionFee(transaction, feeRate);
  return generateSignedTransaction({ ...options, fee: fee.toNumber() } as any);
});

export const localTransactionState = atom(get => {
  const selectedAsset = get(selectedAssetStore);
  return selectedAsset?.type === 'stx'
    ? get(tokenTransferTransaction)
    : get(ftTokenTransferTransactionState);
});
