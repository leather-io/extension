import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';

import type { Stx20Balance, Stx20Token } from '@app/api/stacks/types/stx20-types';

import { useStx20BalancesQuery } from './stx20-tokens.query';

function makeStx20Token(token: Stx20Balance): Stx20Token {
  return {
    ...token,
    balance: createMoney(new BigNumber(token.balance), token.ticker, 0),
    marketData: null,
  };
}

export function useStx20Tokens(address: string) {
  return useStx20BalancesQuery(address, {
    select: resp => resp.map(balance => makeStx20Token(balance)),
  });
}
