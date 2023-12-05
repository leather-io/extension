import { useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Flex } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { whenStacksChainId } from '@app/common/utils';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { ActionButton } from '@app/ui/components/account/action-button';
import { CreditCardIcon, InboxIcon, SwapIcon } from '@app/ui/icons';

import { SendButton } from './send-button';

export function AccountActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const isBitcoinEnabled = useConfigBitcoinEnabled();
  const stacksAccount = useCurrentStacksAccount();
  const currentBtcSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const btcAccount = currentBtcSigner?.address;
  const currentNetwork = useCurrentNetwork();

  const receivePath = isBitcoinEnabled
    ? RouteUrls.Receive
    : `${RouteUrls.Home}${RouteUrls.ReceiveStx}`;

  return (
    <Flex gap={{ base: 'space.01', md: 'space.04' }} py="space.04" justifyContent="space-between">
      <SendButton />
      <ActionButton
        data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
        icon={<InboxIcon />}
        label="Receive"
        onClick={() => navigate(receivePath, { state: { backgroundLocation: location } })}
      />

      {(!!stacksAccount || !!btcAccount) && (
        <ActionButton
          data-testid={HomePageSelectors.FundAccountBtn}
          icon={<CreditCardIcon />}
          label="Buy"
          onClick={() => navigate(RouteUrls.FundChooseCurrency)}
        />
      )}
      {whenStacksChainId(currentNetwork.chain.stacks.chainId)({
        [ChainID.Mainnet]: (
          <ActionButton
            data-testid={HomePageSelectors.SwapBtn}
            icon={<SwapIcon />}
            label="Swap"
            onClick={() => navigate(RouteUrls.Swap)}
          />
        ),
        [ChainID.Testnet]: null,
      })}
    </Flex>
  );
}
