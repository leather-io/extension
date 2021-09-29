import { useAtomValue } from 'jotai/utils';
import { addressToString, PostCondition, PostConditionType } from '@stacks/transactions';
import { postConditionModeState } from '@store/transactions/post-conditions';
import { useFungibleTokenMetaDataState } from '@store/assets/fungile-tokens.hooks';

export const usePostConditionModeState = () => {
  return useAtomValue(postConditionModeState);
};

export const useAssetFromPostCondition = (pc: PostCondition) => {
  let contractAddress: string = '';
  let contractName: string = '';
  if (pc.conditionType === PostConditionType.Fungible) {
    contractAddress = addressToString(pc?.assetInfo.address);
    contractName = pc.assetInfo.contractName.content;
  }

  const contractId = `${contractAddress}.${contractName}`;
  const asset = useFungibleTokenMetaDataState(contractId);

  if (!asset) return;
  // Need to check this here bc the contractId can be '.' and return
  // an object with all undefined property values
  const isEmpty = Object.values(asset).every(x => x === undefined);
  if (isEmpty) return;
  if ('error' in asset) return;
  return asset;
};
