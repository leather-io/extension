import { Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { useStxCryptoAssetBalance, useTransferableSip10Tokens } from '@leather.io/query';
import { IconButton, PaperPlaneIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

function SendButtonSuspense() {
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const btcAddress = useCurrentAccountNativeSegwitIndexZeroSignerNullable()?.address;
  const stxAddress = useCurrentStacksAccountAddress();
  const { filteredBalanceQuery } = useStxCryptoAssetBalance(stxAddress);
  const stacksFtAssets = useTransferableSip10Tokens(stxAddress);

  const isDisabled = !btcAddress && !filteredBalanceQuery.data && stacksFtAssets?.length === 0;

  return (
    <IconButton
      data-testid={HomePageSelectors.SendCryptoAssetBtn}
      label="Send"
      icon={<PaperPlaneIcon />}
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

const SendButtonFallback = memo(() => (
  <IconButton label="Send" icon={<PaperPlaneIcon />} disabled />
));

export function SendButton() {
  return (
    <Suspense fallback={<SendButtonFallback />}>
      <SendButtonSuspense />
    </Suspense>
  );
}
