import { createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { useConfigRunesEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { RuneBalance, RuneTickerInfo, RuneToken } from '../bitcoin-client';
import { useGetRunesOutputsByAddressQuery } from './runes-outputs-by-address.query';
import { useGetRunesTickerInfoQuery } from './runes-ticker-info.query';
import { useGetRunesWalletBalancesByAddressesQuery } from './runes-wallet-balances.query';

const defaultRunesSymbol = '¤';

function makeRuneToken(runeBalance: RuneBalance, tickerInfo: RuneTickerInfo): RuneToken {
  return {
    balance: createMoney(
      Number(runeBalance.total_balance),
      tickerInfo.rune_name,
      tickerInfo.decimals
    ),
    tokenData: {
      ...runeBalance,
      ...tickerInfo,
      symbol: tickerInfo.symbol ?? defaultRunesSymbol,
    },
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

  return runesBalances
    .map(r => {
      const tickerInfo = runesTickerInfo.find(t => t.rune_name === r.rune_name);
      if (!tickerInfo) return;
      return makeRuneToken(r, tickerInfo);
    })
    .filter(isDefined);
}

export function useRunesOutputsByAddress(address: string) {
  return useGetRunesOutputsByAddressQuery(address);
}
