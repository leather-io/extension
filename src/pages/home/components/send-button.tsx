import { RouteUrls } from '@routes/route-urls';
import React, { memo } from 'react';
import { useTransferableAssets } from '@store/assets/asset.hooks';
import { WalletPageSelectors } from '@tests/page-objects/wallet.selectors';
import { TxButton } from './tx-button';

const SendButtonSuspense = () => {
  const assets = useTransferableAssets();
  const isDisabled = !assets || assets?.length === 0;
  return (
    <TxButton
      isDisabled={isDisabled}
      path={RouteUrls.Send}
      data-testid={WalletPageSelectors.BtnSendTokens}
      kind="send"
    />
  );
};
const SendButtonFallback = memo(() => <TxButton isDisabled path={RouteUrls.Send} kind="send" />);
export const SendButton = () => (
  <React.Suspense fallback={<SendButtonFallback />}>
    <SendButtonSuspense />
  </React.Suspense>
);
