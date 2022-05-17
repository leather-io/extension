import { memo, Suspense } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { ButtonProps } from '@stacks/ui';

import { useTransferableAssets } from '@app/store/assets/asset.hooks';
import { RouteUrls } from '@shared/route-urls';
import { HomePageSelectors } from '@tests/page-objects/home.selectors';

import { TxButton } from './tx-button';

const SendTxButton = (props: ButtonProps) => (
  <TxButton
    data-testid={HomePageSelectors.BtnSendTokens}
    icon={FiArrowUp}
    route={RouteUrls.Send}
    type="Send"
    {...props}
  />
);

const SendButtonSuspense = () => {
  const assets = useTransferableAssets();
  const isDisabled = !assets || assets?.length === 0;
  return <SendTxButton isDisabled={isDisabled} />;
};

const SendButtonFallback = memo(() => <SendTxButton isDisabled />);

export const SendButton = () => (
  <Suspense fallback={<SendButtonFallback />}>
    <SendButtonSuspense />
  </Suspense>
);
