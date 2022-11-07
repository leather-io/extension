import { memo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';
import { ButtonProps } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';
import { PrimaryButton } from '@app/components/primary-button';
import { useWalletType } from '@app/common/use-wallet-type';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { whenPageMode } from '@app/common/utils';
import { HomePageSelectors } from '@tests/page-objects/home.selectors';
import {
  useStacksCryptoCurrencyAssetBalance,
  useTransferableStacksFungibleTokenAssetBalances,
} from '@app/query/stacks/balance/crypto-asset-balances.hooks';

import { HomeActionButton } from './tx-button';

const SendTxButton = (props: ButtonProps) => (
  <HomeActionButton
    data-testid={HomePageSelectors.BtnSendTokens}
    icon={FiArrowUp}
    label="Send"
    buttonComponent={PrimaryButton}
    {...props}
  />
);

const SendButtonSuspense = () => {
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const stxCryptAssetBalance = useStacksCryptoCurrencyAssetBalance();
  const ftAssets = useTransferableStacksFungibleTokenAssetBalances();
  const isDisabled = !stxCryptAssetBalance && ftAssets?.length === 0;
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
