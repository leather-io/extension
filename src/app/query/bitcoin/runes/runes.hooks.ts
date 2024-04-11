import { createMoney } from '@shared/models/money.model';

import type { RuneToken } from '../bitcoin-client';
import { useGetRunesWalletBalancesQuery } from './runes-wallet-balances.query';

export function useRuneTokens(address: string) {
  return useGetRunesWalletBalancesQuery(address, {
    select: resp =>
      resp.map(rune => {
        return {
          ...rune,
          balance: createMoney(Number(rune.total_balance), rune.rune_name, 0),
        } as RuneToken;
      }),
  });
}
