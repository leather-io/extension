import { createMoney } from '@shared/models/money.model';

import type { RuneBalance, RuneToken } from '../bitcoin-client';
import { useGetRunesWalletBalancesByAddressesQuery } from './runes-wallet-balances.query';

function makeRuneToken(rune: RuneBalance): RuneToken {
  return {
    ...rune,
    balance: createMoney(Number(rune.total_balance), rune.rune_name, 0),
  };
}

export function useRuneTokens(addresses: string[]) {
  return useGetRunesWalletBalancesByAddressesQuery(addresses, {
    select: resp => resp.map(makeRuneToken),
  });
}
