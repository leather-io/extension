import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';

import type { Stx20Balance, Stx20Token } from '../stacks-client';
import { useStx20BalancesQuery } from './stx20-tokens.query';

function createStx20Token(token: Stx20Balance): Stx20Token {
  return {
    balance: createMoney(new BigNumber(token.balance), token.ticker, 0),
    marketData: null,
    tokenData: token,
  };
}

export function useStx20Tokens(address: string) {
  return useStx20BalancesQuery(address, {
    select: resp => resp.map(balance => createStx20Token(balance)),
  });
}
