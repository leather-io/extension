import { useGetFungibleTokenMetadataQuery } from './fungible-token-metadata.query';

export function useFungibleTokenMetadata(contractId: string) {
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(contractId);
  return ftMetadata;
}
