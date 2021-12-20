import { useAtomValue } from 'jotai/utils';
import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { fungibleTokenMetaDataState } from '@app/store/assets/fungible-tokens';

export const useFungibleTokenMetaDataState = (contractId: string) => {
  const network = useCurrentNetwork();
  return useAtomValue(fungibleTokenMetaDataState([contractId, network.url]));
};
