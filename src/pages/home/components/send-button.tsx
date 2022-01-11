import React, { memo, Suspense } from 'react';

import { useTransferableAssets } from '@store/assets/asset.hooks';
import { WalletPageSelectors } from '@tests/page-objects/wallet.selectors';

import { SendTxButton } from './tx-button';

const SendButtonSuspense = () => {
  const assets = useTransferableAssets();
  const isDisabled = !assets || assets?.length === 0;
  return <SendTxButton isDisabled={isDisabled} data-testid={WalletPageSelectors.BtnSendTokens} />;
};

const SendButtonFallback = memo(() => <SendTxButton isDisabled />);

export const SendButton = () => (
  <Suspense fallback={<SendButtonFallback />}>
    <SendButtonSuspense />
  </Suspense>
);
