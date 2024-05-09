import { Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { useTransferableStacksFungibleTokenAssetBalances } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { useStxCryptoAssetBalance } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { IconButton } from '@app/ui/components/icon-button/icon-button';
import { SendIcon } from '@app/ui/icons';

function SendButtonSuspense() {
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const account = useCurrentStacksAccount();
  const { data: stxCryptoAssetBalance } = useStxCryptoAssetBalance(account?.address ?? '');
  const ftAssets = useTransferableStacksFungibleTokenAssetBalances(account?.address ?? '');
  const isDisabled = !stxCryptoAssetBalance && ftAssets?.length === 0;

  return (
    <IconButton
      data-testid={HomePageSelectors.SendCryptoAssetBtn}
      label="Send"
      icon={<SendIcon />}
      onClick={() =>
        whenWallet({
          ledger: () =>
            whenPageMode({
              full: () => navigate(RouteUrls.SendCryptoAsset),
              popup: () => openIndexPageInNewTab(RouteUrls.SendCryptoAsset),
            })(),
          software: () => navigate(RouteUrls.SendCryptoAsset),
        })()
      }
      disabled={isDisabled}
    />
  );
}

const SendButtonFallback = memo(() => <IconButton label="Send" icon={<SendIcon />} disabled />);

export function SendButton() {
  return (
    <Suspense fallback={<SendButtonFallback />}>
      <SendButtonSuspense />
    </Suspense>
  );
}
