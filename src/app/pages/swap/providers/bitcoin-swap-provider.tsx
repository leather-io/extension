import { Outlet } from 'react-router-dom';

import type { P2Ret } from '@scure/btc-signer/payment';

import type { UtxoResponseItem } from '@leather.io/query';

import type { Signer } from '@app/store/accounts/blockchain/bitcoin/bitcoin-signer';

import { SwapForm } from '../form/swap-form';
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
  const { fetchQuoteAmount, onSubmitSwapForReview, onSubmitSwap } = useBitcoinSwap(signer, utxos);

  return (
    <SwapProvider<BitcoinSwapContext>
      initialData={{
        maxSignerFee: defaultMaxSignerFee,
        protocol: 'sBTC Protocol',
        signer,
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
