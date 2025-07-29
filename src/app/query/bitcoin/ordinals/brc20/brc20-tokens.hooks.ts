import BigNumber from 'bignumber.js';

import { type Brc20Asset, createMarketData, createMarketPair } from '@leather.io/models';
import { isFetchedWithSuccess } from '@leather.io/query';
import { createBaseCryptoAssetBalance, createMoney, unitToFractionalUnit } from '@leather.io/utils';

import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';
import { useConfigOrdinalsbot } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useGetBrc20TokensQuery } from './brc20-tokens.query';

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

function createBrc20Asset(decimals: number, ticker: string): Brc20Asset {
  return {
    chain: 'bitcoin',
    category: 'fungible',
    protocol: 'brc20',
    decimals,
    hasMemo: false,
    symbol: ticker,
  };
}

export function useBrc20Tokens() {
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();

  const result = useGetBrc20TokensQuery({
    createTaprootSigner,
    nativeSegwitAddress: nativeSegwitSigner.address,
  });

  if (!isFetchedWithSuccess(result)) return [];

  const tokens = result.data.pages
    .flatMap(page => page.brc20Tokens)
    .filter(token => token.length > 0)
    .flatMap(token => token);

  return tokens.map(token => {
    const fiatPrice = calculateBitcoinFiatValue(
      createMoney(new BigNumber(token.balance.min_listed_unit_price ?? 0), 'BTC')
    );
    return {
      balance: createBaseCryptoAssetBalance(
        createMoney(
          unitToFractionalUnit(token.info.decimals)(new BigNumber(token.balance.overall_balance)),
          token.balance.ticker,
          token.info.decimals
        )
      ),
      info: createBrc20Asset(token.info.decimals, token.balance.ticker),
      holderAddress: token.holderAddress,
      marketData: createMarketData(
        createMarketPair(token.balance.ticker, 'USD'),
        createMoney(fiatPrice.amount, 'USD')
      ),
    };
  });
}
