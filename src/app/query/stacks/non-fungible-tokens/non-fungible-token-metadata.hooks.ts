import { useGetNonFungibleTokenMetadataListQuery } from './non-fungible-token-metadata.query';

export function useNonFungibleTokensMetadata() {
  const respList = useGetNonFungibleTokenMetadataListQuery();
  return respList.map(resp => resp.data).filter(data => data?.token_uri);
}
