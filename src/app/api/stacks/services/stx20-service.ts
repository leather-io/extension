import { stx20ApiClient } from '../clients/stx20-api-client';
import type { Stx20Balance, Stx20BalanceResponse } from '../types/stx20-types';

export async function fetchStx20Balances(address: string): Promise<Stx20Balance[]> {
  const response = await stx20ApiClient().get<Stx20BalanceResponse>(`/balance/${address}`);
  return response.data.balances;
}
