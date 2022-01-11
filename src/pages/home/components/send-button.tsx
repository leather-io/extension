import React, { memo } from 'react';
import { useTransferableAssets } from '@store/assets/asset.hooks';
import { WalletPageSelectors } from '@tests/page-objects/wallet.selectors';
import { BuyTxButton, SendTxButton } from './tx-button';
import { useHasFiatProviders } from '@query/hiro-config/hiro-config.query';

const SendButtonSuspense = () => {
  const assets = useTransferableAssets();
  const isDisabled = !assets || assets?.length === 0;
  return <SendTxButton isDisabled={isDisabled} data-testid={WalletPageSelectors.BtnSendTokens} />;
};

const SendButtonFallback = memo(() => <SendTxButton isDisabled />);

export const SendButton = () => (
  <React.Suspense fallback={<SendButtonFallback />}>
    <SendButtonSuspense />
  </React.Suspense>
);

const BuyButtonFallback = memo(() => <BuyTxButton isDisabled />);

export const BuyButton = () => {
  const hasFiatProviders = useHasFiatProviders();
  if (!hasFiatProviders) return null;
  return (
    <React.Suspense fallback={<BuyButtonFallback />}>
      <BuyTxButton />
    </React.Suspense>
  );
};
