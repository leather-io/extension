import { atom } from 'jotai';
import { selectedAssetStore } from '@store/assets/asset-search';
import {
  currentAccountBalancesUnanchoredState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@store/accounts';
import { currentStacksNetworkState } from '@store/networks';
import { currentAccountNonceState } from '@store/accounts/nonce';
import { ftUnshiftDecimals } from '@common/stacks-utils';
import { makePostCondition } from '@pages/transaction-signing/hooks/use-asset-transfer';
import {
  AnchorMode,
  bufferCVFromString,
  ClarityValue,
  createAddress,
  makeContractCall,
  noneCV,
  someCV,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { AssetWithMeta } from '@common/asset-types';
import BN from 'bn.js';

export const makeFungibleTokenTransferState = atom(get => {
  const asset = get(selectedAssetStore);
  const currentAccount = get(currentAccountState);
  const network = get(currentStacksNetworkState);
  const balances = get(currentAccountBalancesUnanchoredState);
  const stxAddress = get(currentAccountStxAddressState);
  const nonce = get(currentAccountNonceState);
  if (!stxAddress || typeof nonce === 'undefined') return;

  if (asset && currentAccount && stxAddress) {
    const { contractName, contractAddress, name: assetName } = asset;
    return {
      asset,
      stxAddress,
      nonce,
      balances,
      network,
      senderKey: currentAccount.stxPrivateKey,
      assetName,
      contractAddress,
      contractName,
    };
  }
  return;
});

interface AssetTransferTxOptions {
  amount: number;
  balances: any;
  memo: string;
  network: StacksNetwork;
  nonce: number;
  recipient: string;
  selectedAsset: AssetWithMeta;
  senderKey: string;
  stxAddress: string;
}

export const buildAssetTransferTx = ({
  amount,
  balances,
  memo,
  network,
  nonce,
  recipient,
  selectedAsset,
  senderKey,
  stxAddress,
}: AssetTransferTxOptions) => {
  const { contractAddress, contractName } = selectedAsset;
  const tokenBalanceKey = Object.keys(balances?.fungible_tokens || {}).find(contract => {
    return contract.startsWith(contractAddress);
  });
  const realAmount = ftUnshiftDecimals(amount, selectedAsset?.meta?.decimals || 0);
  const postConditionOptions = tokenBalanceKey
    ? {
        contractAddress,
        contractName,
        assetName: selectedAsset.name,
        stxAddress,
        amount: realAmount,
      }
    : undefined;

  const postConditions = postConditionOptions ? [makePostCondition(postConditionOptions)] : [];
  const functionArgs: ClarityValue[] = [
    uintCV(realAmount),
    standardPrincipalCVFromAddress(createAddress(stxAddress)),
    standardPrincipalCVFromAddress(createAddress(recipient)),
  ];
  if (selectedAsset.hasMemo) {
    functionArgs.push(memo !== '' ? someCV(bufferCVFromString(memo)) : noneCV());
  }

  let txData = {
    network,
    functionName: 'transfer',
    functionArgs,
    senderKey,
    contractAddress,
    contractName,
    postConditions,
    nonce: new BN(nonce, 10),
    anchorMode: AnchorMode.Any,
  };
  return makeContractCall(txData);
};

makeFungibleTokenTransferState.debugLabel = 'makeFungibleTokenTransferState';
