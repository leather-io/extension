import type { Stx20CryptoAssetInfo } from '@leather-wallet/models';
import { createMoney } from '@leather-wallet/utils';
import BigNumber from 'bignumber.js';

import { createCryptoAssetBalance } from '@app/query/common/models';

import type { Stx20Balance } from '../stacks-client';
import { useStx20BalancesQuery } from './stx20-tokens.query';

function createStx20CryptoAssetInfo(stx20Balance: Stx20Balance): Stx20CryptoAssetInfo {
  return {
    name: 'stx-20',
    symbol: stx20Balance.ticker,
  };
}

export function useStx20Tokens(address: string) {
  return useStx20BalancesQuery(address, {
    select: resp =>
      resp.map(stx20Balance => ({
        balance: createCryptoAssetBalance(
          createMoney(new BigNumber(stx20Balance.balance), stx20Balance.ticker, 0)
        ),
        info: createStx20CryptoAssetInfo(stx20Balance),
      })),
  });
}
