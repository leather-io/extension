import { Outlet } from 'react-router';

import type { RouteQuote } from '@bitflowlabs/core-sdk';
import type { StacksTransactionWire } from '@stacks/transactions';

import { defaultSwapFee } from '@leather.io/query';

import type { SbtcSponsorshipEligibility } from '@app/query/sbtc/sponsored-transactions.query';

import { SwapForm } from '../form/swap-form';
import { useAllSwappableAssets } from '../hooks/use-all-swappable-assets';
import { SwapProvider } from '../swap-provider';
import type { BaseSwapContext } from '../swap.context';
import { useStacksSwap } from './use-stacks-swap';

export interface StacksSwapContext extends BaseSwapContext<StacksSwapContext> {
  nonce: number | string;
  routeQuote?: RouteQuote;
  slippage: number;
  sponsorship?: SbtcSponsorshipEligibility;
  unsignedTx?: StacksTransactionWire;
}

interface StacksSwapProviderProps {
  nonce: number | string;
}
export function StacksSwapProvider({ nonce }: StacksSwapProviderProps) {
  const { allSwappableAssets, stacksSwappableAssetsQuote } = useAllSwappableAssets();
  const { fetchQuoteAmount, onSubmitSwapForReview, onSubmitSwap } = useStacksSwap(nonce);

  return (
    <SwapProvider<StacksSwapContext>
      initialData={{
        chain: 'stacks',
        fee: defaultSwapFee,
        nonce,
        protocol: 'Bitflow',
        slippage: 0.04,
        swappableAssetsBase: allSwappableAssets,
        swappableAssetsQuote: stacksSwappableAssetsQuote,
        timestamp: new Date().toISOString(),
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
