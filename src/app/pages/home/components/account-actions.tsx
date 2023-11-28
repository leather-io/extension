import { useLocation, useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Flex, FlexProps } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';
import { PlusIcon } from '@app/ui/components/icons/plus-icon';
import { SwapIcon } from '@app/ui/components/icons/swap-icon';

import { ActionButton } from './action-button';
import { SendButton } from './send-button';

export function AccountActions(props: FlexProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isBitcoinEnabled = useConfigBitcoinEnabled();
  const { whenWallet } = useWalletType();
  const stacksAccount = useCurrentStacksAccount();

  const receivePath = isBitcoinEnabled
    ? RouteUrls.Receive
    : `${RouteUrls.Home}${RouteUrls.ReceiveStx}`;

  return (
    <Flex justify="space-between" {...props}>
      <SendButton />
      <ActionButton
        data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
        icon={<ArrowDownIcon />}
        label="Receive"
        onClick={() => navigate(receivePath, { state: { backgroundLocation: location } })}
      />

      {!!stacksAccount && (
        <ActionButton
          data-testid={HomePageSelectors.FundAccountBtn}
          icon={<PlusIcon />}
          label="Buy"
          onClick={() => navigate(RouteUrls.Fund)}
        />
      )}

      {whenWallet({
        software: (
          <ActionButton icon={<SwapIcon />} label="Swap" onClick={() => navigate(RouteUrls.Swap)} />
        ),
        ledger: null,
      })}
    </Flex>
  );
}
