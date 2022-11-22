import { Suspense, memo } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests-legacy/page-objects/home.selectors';

import { featureFlags } from '@shared/feature-flags';
import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { PrimaryButton } from '@app/components/primary-button';
import {
  useStacksAnchoredCryptoCurrencyAssetBalance,
  useTransferableStacksFungibleTokenAssetBalances,
} from '@app/query/stacks/balance/crypto-asset-balances.hooks';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

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
  const account = useCurrentAccount();
  const stxCryptAssetBalance = useStacksAnchoredCryptoCurrencyAssetBalance(account?.address ?? '');
  const ftAssets = useTransferableStacksFungibleTokenAssetBalances(account?.address ?? '');
  const isDisabled = !stxCryptAssetBalance && ftAssets?.length === 0;
  return (
    <SendTxButton
      onClick={() =>
        whenWallet({
          ledger: () =>
            featureFlags.bitcoinEnabled
              ? whenPageMode({
                  full: () => navigate(RouteUrls.SendCryptoAsset),
                  popup: () => openIndexPageInNewTab(RouteUrls.SendCryptoAsset),
                })()
              : whenPageMode({
                  full: () => navigate(RouteUrls.Send),
                  popup: () => openIndexPageInNewTab(RouteUrls.Send),
                })(),
          software: () =>
            featureFlags.bitcoinEnabled
              ? navigate(RouteUrls.SendCryptoAsset)
              : navigate(RouteUrls.Send),
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
