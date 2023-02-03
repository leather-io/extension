import { Suspense, memo } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { PrimaryButton } from '@app/components/primary-button';
import {
  useStacksAnchoredCryptoCurrencyAssetBalance,
  useTransferableStacksFungibleTokenAssetBalances,
} from '@app/query/stacks/balance/crypto-asset-balances.hooks';
import { useCurrentAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useBitcoinFeature } from '@app/store/feature-flags/feature-flags.slice';

import { HomeActionButton } from './tx-button';

function SendTxButton(props: ButtonProps) {
  return (
    <HomeActionButton
      data-testid={HomePageSelectors.SendCryptoAssetBtn}
      icon={FiArrowUp}
      label="Send"
      buttonComponent={PrimaryButton}
      {...props}
    />
  );
}

function SendButtonSuspense() {
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const account = useCurrentAccount();
  const stxAssetBalance = useStacksAnchoredCryptoCurrencyAssetBalance(account?.address ?? '');
  const ftAssets = useTransferableStacksFungibleTokenAssetBalances(account?.address ?? '');
  const isDisabled = !stxAssetBalance && ftAssets?.length === 0;
  const isBitcoinEnabled = useBitcoinFeature();
  return (
    <SendTxButton
      onClick={() =>
        whenWallet({
          ledger: () =>
            isBitcoinEnabled
              ? whenPageMode({
                  full: () => navigate(RouteUrls.SendCryptoAsset),
                  popup: () => openIndexPageInNewTab(RouteUrls.SendCryptoAsset),
                })()
              : whenPageMode({
                  full: () => navigate(RouteUrls.Send),
                  popup: () => openIndexPageInNewTab(RouteUrls.Send),
                })(),
          software: () =>
            isBitcoinEnabled ? navigate(RouteUrls.SendCryptoAsset) : navigate(RouteUrls.Send),
        })()
      }
      isDisabled={isDisabled}
    />
  );
}

const SendButtonFallback = memo(() => <SendTxButton isDisabled />);

export function SendButton() {
  return (
    <Suspense fallback={<SendButtonFallback />}>
      <SendButtonSuspense />
    </Suspense>
  );
}
