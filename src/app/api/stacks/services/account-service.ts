import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import type { DefaultNetworkConfigurations } from '@shared/constants';

// import type { AddressBalanceResponse } from '@shared/models/account.model';
import { hiroApiClient } from '../clients/hiro-api-client';

export function fetchAccountBalances(network: DefaultNetworkConfigurations, signal?: AbortSignal) {
  return async (principal: string): Promise<AddressBalanceResponse> => {
    const response = await hiroApiClient(network).get<AddressBalanceResponse>(
      `/extended/v1/address/${principal}/balances`,
      { signal }
    );
    return response.data;
  };
}
