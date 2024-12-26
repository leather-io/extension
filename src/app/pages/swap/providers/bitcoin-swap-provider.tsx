import { Outlet } from 'react-router-dom';

import type { P2Ret } from '@scure/btc-signer/payment';
import BigNumber from 'bignumber.js';

import type { UtxoResponseItem } from '@leather.io/query';
import { createMoney } from '@leather.io/utils';

import type { Signer } from '@app/store/accounts/blockchain/bitcoin/bitcoin-signer';

import { SwapForm } from '../form/swap-form';
import { useAllSwappableAssets } from '../hooks/use-all-swappable-assets';
import { type SbtcDeposit, defaultMaxSignerFee } from '../hooks/use-sbtc-deposit-transaction';
import { SwapProvider } from '../swap-provider';
import type { BaseSwapContext } from '../swap.context';
import { useBitcoinSwap } from './use-bitcoin-swap';

export interface BitcoinSwapContext extends BaseSwapContext<BitcoinSwapContext> {
  deposit?: SbtcDeposit;
  maxSignerFee: number;
  signer: Signer<P2Ret>;
  utxos: UtxoResponseItem[];
}

interface BitcoinSwapProviderProps {
  signer: Signer<P2Ret>;
  utxos: UtxoResponseItem[];
}
export function BitcoinSwapProvider({ signer, utxos }: BitcoinSwapProviderProps) {
  const { allSwappableAssets, bitcoinSwappableAssetsQuote } = useAllSwappableAssets();
  const { fetchQuoteAmount, onSubmitSwapForReview, onSubmitSwap } = useBitcoinSwap(signer, utxos);

  return (
    <SwapProvider<BitcoinSwapContext>
      initialData={{
        chain: 'bitcoin',
        fee: createMoney(new BigNumber(0), 'BTC'),
        maxSignerFee: defaultMaxSignerFee,
        protocol: 'sBTC Protocol',
        signer,
        swappableAssetsBase: allSwappableAssets,
        swappableAssetsQuote: bitcoinSwappableAssetsQuote,
        timestamp: new Date().toISOString(),
        utxos,
        fetchQuoteAmount,
        onSubmitSwapForReview,
        onSubmitSwap,
      }}
    >
      <SwapForm>
        <Outlet />
      </SwapForm>
    </SwapProvider>
  );
}
