import { useAtomValue } from 'jotai/utils';
import { addressToString, PostCondition, PostConditionType } from '@stacks/transactions';
import { postConditionModeState } from '@store/transactions/post-conditions';
import { fungibleTokenMetaDataState } from '@store/assets/fungible-tokens';
import { useCurrentNetworkState } from '@store/network/networks.hooks';

export const usePostConditionModeState = () => {
  return useAtomValue(postConditionModeState);
};

export const useAssetFromPostCondition = (pc: PostCondition) => {
  if (pc.conditionType !== PostConditionType.Fungible) return;
  const network = useCurrentNetworkState();
  const contractAddress = addressToString(pc.assetInfo.address);
  const contractName = pc.assetInfo.contractName.content;

  const asset = useAtomValue(
    fungibleTokenMetaDataState([`${contractAddress}.${contractName}`, network.url])
  );
  if (!asset) return;
  if ('error' in asset) return;
  return asset;
};
