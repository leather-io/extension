import { Suspense, memo } from 'react';
import { useNavigate } from 'react-router';

import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { IconButton, PaperPlaneIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { useStxAddressBalance } from '@app/query/stacks/balance/stx-balance.hooks';
import { useSip10AddressTransferableTokenBalances } from '@app/query/stacks/sip10/sip10-balance.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

function SendButtonSuspense() {
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const btcAddress = useCurrentAccountNativeSegwitIndexZeroSignerNullable()?.address;
  const stxAddress = useCurrentStacksAccountAddress();
  const stxBalance = useStxAddressBalance(stxAddress);
  const { sip10s: stacksFtAssets } = useSip10AddressTransferableTokenBalances(stxAddress);

  const isDisabled = !btcAddress && !stxBalance.value && stacksFtAssets.length === 0;

  return (
    <IconButton
      data-testid={HomePageSelectors.SendCryptoAssetBtn}
      label="Send"
      icon={<PaperPlaneIcon />}
      onClick={() =>
        whenWallet({
          ledger: () =>
            whenPageMode({
              full: () => void navigate(RouteUrls.SendCryptoAsset),
              popup: () => void openIndexPageInNewTab(RouteUrls.SendCryptoAsset),
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
