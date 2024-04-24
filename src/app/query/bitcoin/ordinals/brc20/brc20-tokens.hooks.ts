import BigNumber from 'bignumber.js';

import { createMarketData, createMarketPair } from '@shared/models/market.model';
import { createMoney } from '@shared/models/money.model';

import { unitToFractionalUnit } from '@app/common/money/unit-conversion';
import { useGetBrc20TokensQuery } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';
import { useConfigOrdinalsbot } from '@app/query/common/remote-config/remote-config.query';
import { useAppDispatch } from '@app/store';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { brc20TransferInitiated } from '@app/store/ordinals/ordinals.slice';

import type { Brc20Token } from '../../bitcoin-client';
import { useAverageBitcoinFeeRates } from '../../fees/fee-estimates.hooks';
import { useOrdinalsbotClient } from '../../ordinalsbot-client';
import { createBrc20TransferInscription, encodeBrc20TransferInscription } from './brc20.utils';

// ts-unused-exports:disable-next-line
export function useBrc20FeatureFlag() {
  const currentNetwork = useCurrentNetwork();

  const ordinalsbotConfig = useConfigOrdinalsbot();

  if (!ordinalsbotConfig.integrationEnabled) {
    return { enabled: false, reason: 'BRC-20 transfers are temporarily disabled' } as const;
  }

  const supportedNetwork =
    currentNetwork.chain.bitcoin.bitcoinNetwork === 'mainnet' ||
    currentNetwork.chain.bitcoin.bitcoinNetwork === 'signet';

  if (!supportedNetwork) return { enabled: false, reason: 'Unsupported network' } as const;

  // TODO: Add api availability check

  return { enabled: true } as const;
}

export function useBrc20Transfers(holderAddress: string) {
  const dispatch = useAppDispatch();
  const currentAccountIndex = useCurrentAccountIndex();
  const ordinalsbotClient = useOrdinalsbotClient();
  const { data: fees } = useAverageBitcoinFeeRates();

  return {
    async initiateTransfer(tick: string, amount: string) {
      const transferInscription = createBrc20TransferInscription(tick, Number(amount));
      const { payload, size } = encodeBrc20TransferInscription(transferInscription);

      const order = await ordinalsbotClient.order({
        receiveAddress: holderAddress,
        file: payload,
        size,
        name: `${tick}-${amount}.txt`,
        fee: fees?.halfHourFee.toNumber() ?? 10,
      });

      if (order.data.status !== 'ok') throw new Error('Failed to initiate transfer');

      return { id: order.data.id, order };
    },

    inscriptionPaymentTransactionComplete(
      orderId: string,
      amount: number,
      recipient: string,
      tick: string
    ) {
      dispatch(
        brc20TransferInitiated({
          accountIndex: currentAccountIndex,
          amount,
          tick,
          recipient,
          status: 'pending',
          id: orderId,
        })
      );
    },
  };
}

function makeBrc20Token(token: Brc20Token) {
  return {
    ...token,
    balance: createMoney(
      unitToFractionalUnit(token.decimals)(new BigNumber(token.overall_balance)),
      token.ticker,
      token.decimals
    ),
    marketData: token.min_listed_unit_price
      ? createMarketData(
          createMarketPair(token.ticker, 'USD'),
          createMoney(new BigNumber(token.min_listed_unit_price), 'USD')
        )
      : null,
  };
}

export function useBrc20Tokens() {
  const { data: allBrc20TokensResponse } = useGetBrc20TokensQuery();
  const brc20Tokens = allBrc20TokensResponse?.pages
    .flatMap(page => page.brc20Tokens)
    .filter(token => token.length > 0)
    .flatMap(token => token);

  return brc20Tokens?.map(token => makeBrc20Token(token)) ?? [];
}
