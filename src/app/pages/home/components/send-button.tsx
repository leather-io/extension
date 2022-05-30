import { memo, Suspense } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { ButtonProps } from '@stacks/ui';
import { useNavigate } from 'react-router-dom';

import { useTransferableAssets } from '@app/store/assets/asset.hooks';
import { RouteUrls } from '@shared/route-urls';
import { PrimaryButton } from '@app/components/primary-button';
import { WalletPageSelectors } from '@tests/page-objects/wallet.selectors';

import { HomeActionButton } from './tx-button';
import { useWalletType } from '@app/common/use-wallet-type';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { whenPageMode } from '@app/common/utils';

const SendTxButton = (props: ButtonProps) => (
  <HomeActionButton
    data-testid={WalletPageSelectors.BtnSendTokens}
    icon={FiArrowUp}
    label="Send"
    buttonComponent={PrimaryButton}
    {...props}
  />
);

const SendButtonSuspense = () => {
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const assets = useTransferableAssets();
  const isDisabled = !assets || assets?.length === 0;
  return (
    <SendTxButton
      onClick={() =>
        whenWallet({
          ledger: () =>
            whenPageMode({
              full: () => navigate(RouteUrls.Send),
              popup: () => openIndexPageInNewTab(RouteUrls.Send),
            })(),
          software: () => navigate(RouteUrls.Send),
        })()
      }
      isDisabled={isDisabled}
    />
  );
};

const SendButtonFallback = memo(() => <SendTxButton isDisabled />);

export const SendButton = () => (
  <Suspense fallback={<SendButtonFallback />}>
    <SendButtonSuspense />
  </Suspense>
);
