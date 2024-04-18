import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RuneBalance, RuneTickerInfo, RuneToken } from '../bitcoin-client';
import { useGetRunesOutputsByAddressQuery } from './runes-outputs-by-address.query';
import { useGetRunesTickerInfoQuery } from './runes-ticker-info.query';
import { useGetRunesWalletBalancesByAddressesQuery } from './runes-wallet-balances.query';

function makeRuneToken(runeBalance: RuneBalance, tickerInfo: RuneTickerInfo): RuneToken {
  return {
    ...runeBalance,
    ...tickerInfo,
    balance: createMoney(
      Number(runeBalance.total_balance),
      tickerInfo.rune_name,
      tickerInfo.decimals
    ),
  };
}

export function useRunesEnabled() {
  const runesEnabled = useConfigRunesEnabled();
  const network = useCurrentNetwork();

  return runesEnabled || network.chain.bitcoin.bitcoinNetwork === 'testnet';
}

export function useRuneTokens(addresses: string[]) {
  const runesBalances = useGetRunesWalletBalancesByAddressesQuery(addresses)
    .flatMap(query => query.data)
    .filter(isDefined);

  const runesTickerInfo = useGetRunesTickerInfoQuery(runesBalances.map(r => r.rune_name))
    .flatMap(query => query.data)
    .filter(isDefined);

  return runesBalances.map(r => {
    const tickerInfo = runesTickerInfo.find(t => t.rune_name === r.rune_name);
    if (!tickerInfo) {
      logger.error('No ticker info found for Rune');
      return;
    }
    return makeRuneToken(r, tickerInfo);
  });
}

export function useRunesOutputsByAddress(address: string) {
  return useGetRunesOutputsByAddressQuery(address);
}
