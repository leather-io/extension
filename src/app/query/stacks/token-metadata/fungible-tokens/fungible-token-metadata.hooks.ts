import type { AddressBalanceResponse } from '@shared/models/account.model';

import { pullContractIdFromIdentity } from '@app/common/utils';

import { useGetFungibleTokenMetadataListQuery } from './fungible-token-metadata.query';

export function useStacksAccountFungibleTokenMetadata(
  tokens: AddressBalanceResponse['fungible_tokens']
) {
  const tokenContractIds = Object.keys(tokens).map(key => pullContractIdFromIdentity(key));
  return useGetFungibleTokenMetadataListQuery(tokenContractIds);
}
