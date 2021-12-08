import React, { memo, Suspense } from 'react';

import { useHasFiatProviders } from '@query/hiro-config/hiro-config.query';

import { BuyTxButton } from './tx-button';

const BuyButtonFallback = memo(() => <BuyTxButton isDisabled />);

export const BuyButton = () => {
  const hasFiatProviders = useHasFiatProviders();
  if (!hasFiatProviders) return null;
  return (
    <Suspense fallback={<BuyButtonFallback />}>
      <BuyTxButton />
    </Suspense>
  );
};
