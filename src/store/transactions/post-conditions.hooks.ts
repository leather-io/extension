import { useAtomValue } from 'jotai/utils';
import { addressToString, FungiblePostCondition } from '@stacks/transactions';
import { postConditionModeState } from '@store/transactions/post-conditions';
import { useFungibleTokenMetaDataState } from '@store/assets/fungible-tokens.hooks';

export const usePostConditionModeState = () => {
  return useAtomValue(postConditionModeState);
};

export const useAssetFromFungiblePostCondition = (pc: FungiblePostCondition) => {
  const contractAddress = addressToString(pc.assetInfo.address);
  const contractName = pc.assetInfo.contractName.content;
  const contractId = `${contractAddress}.${contractName}`;
  const asset = useFungibleTokenMetaDataState(contractId);
  return !asset || 'error' in asset ? undefined : asset;
};
