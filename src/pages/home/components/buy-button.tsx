import React, { memo, Suspense } from 'react';
import { ChainID } from '@stacks/transactions';
import { useHasFiatProviders } from '@query/hiro-config/hiro-config.query';
import { BuyTxButton } from './tx-button';
import { useCurrentNetworkState } from '@store/network/networks.hooks';

const BuyButtonFallback = memo(() => <BuyTxButton isDisabled />);

export const BuyButton = () => {
  const hasFiatProviders = useHasFiatProviders();
  const currentNetwork = useCurrentNetworkState();
  if (!hasFiatProviders) return null;
  if (currentNetwork.chainId !== ChainID.Mainnet) return null;

  return (
    <Suspense fallback={<BuyButtonFallback />}>
      <BuyTxButton />
    </Suspense>
  );
};
