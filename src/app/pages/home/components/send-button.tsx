import { Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import {
  useStacksAnchoredCryptoCurrencyAssetBalance,
  useTransferableStacksFungibleTokenAssetBalances,
} from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';

import { ActionButton } from './action-button';

function SendButtonSuspense() {
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const account = useCurrentStacksAccount();
  const stxAssetBalance = useStacksAnchoredCryptoCurrencyAssetBalance(account?.address ?? '');
  const ftAssets = useTransferableStacksFungibleTokenAssetBalances(account?.address ?? '');
  const isDisabled = !stxAssetBalance && ftAssets?.length === 0;

  return (
    <ActionButton
      data-testid={HomePageSelectors.SendCryptoAssetBtn}
      label="Send"
      icon={<ArrowUpIcon />}
      onClick={() =>
        whenWallet({
          ledger: () =>
            whenPageMode({
              full: () => navigate(RouteUrls.SendCryptoAsset, { state: { hasHeaderTitle: true } }),
              popup: () => openIndexPageInNewTab(RouteUrls.SendCryptoAsset),
            })(),
          software: () => navigate(RouteUrls.SendCryptoAsset, { state: { hasHeaderTitle: true } }),
        })()
      }
      disabled={isDisabled}
    />
  );
}

const SendButtonFallback = memo(() => (
  <ActionButton label="Send" icon={<ArrowUpIcon />} disabled />
));

export function SendButton() {
  return (
    <Suspense fallback={<SendButtonFallback />}>
      <SendButtonSuspense />
    </Suspense>
  );
}
