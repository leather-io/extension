import { Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useStxCryptoAssetBalance } from '@app/query/stacks/balance/account-balance.hooks';
import { useTransferableSip10Tokens } from '@app/query/stacks/sip10/sip10-tokens.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { IconButton } from '@app/ui/components/icon-button/icon-button';
import { SendIcon } from '@app/ui/icons';

function SendButtonSuspense() {
  const navigate = useNavigate();
  const { whenWallet } = useWalletType();
  const btcAddress = useCurrentAccountNativeSegwitIndexZeroSignerNullable()?.address;
  const { balance: btcBalance } = useBtcCryptoAssetBalanceNativeSegwit(btcAddress ?? '');
  const stxAddress = useCurrentStacksAccountAddress();
  const { data: stxBalance } = useStxCryptoAssetBalance(stxAddress);
  const stacksFtAssets = useTransferableSip10Tokens(stxAddress);

  const isDisabled = !btcBalance && !stxBalance && stacksFtAssets?.length === 0;

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
