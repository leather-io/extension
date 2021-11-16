import React, { memo } from 'react';
import { useTransferableAssets } from '@store/assets/asset.hooks';
import { WalletPageSelectors } from '@tests/page-objects/wallet.selectors';
import { BuyTxButton, SendTxButton } from './tx-button';

const SendButtonSuspense = () => {
  const assets = useTransferableAssets();
  const isDisabled = !assets || assets?.length === 0;
  return <SendTxButton isDisabled={isDisabled} data-testid={WalletPageSelectors.BtnSendTokens} />;
};

const SendButtonFallback = memo(() => <SendTxButton isDisabled />);

const SendButton = () => (
  <React.Suspense fallback={<SendButtonFallback />}>
    <SendButtonSuspense />
  </React.Suspense>
);

const BuyButtonFallback = memo(() => <BuyTxButton isDisabled />);

const BuyButton = () => (
  <React.Suspense fallback={<BuyButtonFallback />}>
    <BuyTxButton />
  </React.Suspense>
);

export const SendBuyButton = () => {
  const assets = useTransferableAssets();
  const totalBalance = assets.reduce((acc, asset) => asset.balance.toNumber() + acc, 0);
  return totalBalance === 0 ? <BuyButton /> : <SendButton />;
};
