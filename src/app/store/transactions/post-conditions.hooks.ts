import { useAtomValue } from 'jotai/utils';
import { addressToString, FungiblePostCondition } from '@stacks/transactions';
import { postConditionModeState } from '@app/store/transactions/post-conditions';
import { useFungibleTokenMetadata } from '@app/query/fungible-tokens/fungible-token-metadata.hooks';

export const usePostConditionModeState = () => {
  return useAtomValue(postConditionModeState);
};

export const useAssetFromFungiblePostCondition = (pc: FungiblePostCondition) => {
  const contractAddress = addressToString(pc.assetInfo.address);
  const contractName = pc.assetInfo.contractName.content;
  const contractId = `${contractAddress}.${contractName}`;
  const asset = useFungibleTokenMetadata(contractId);
  return !asset || 'error' in asset ? undefined : asset;
};
