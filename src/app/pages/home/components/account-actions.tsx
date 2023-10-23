import { useLocation, useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Flex, FlexProps } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useWalletType } from '@app/common/use-wallet-type';
import { ArrowDown } from '@app/components/icons/arrow-down';
import { Plus2 } from '@app/components/icons/plus2';
import { SwapIcon } from '@app/components/icons/swap-icon';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';

import { ActionButton } from './action-button';
import { SendButton } from './send-button';

export function AccountActions(props: FlexProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isBitcoinEnabled = useConfigBitcoinEnabled();
  const { whenWallet } = useWalletType();

  const receivePath = isBitcoinEnabled
    ? RouteUrls.Receive
    : `${RouteUrls.Home}${RouteUrls.ReceiveStx}`;

  return (
    <Flex justify="space-between" {...props}>
      <SendButton />

      <ActionButton
        data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
        icon={<ArrowDown />}
        label="Receive"
        onClick={() =>
          navigate(receivePath, {
            state: {
              backgroundLocation: location,
            },
          })
        }
      />
      <ActionButton
        data-testid={HomePageSelectors.FundAccountBtn}
        icon={<Plus2 />}
        label="Buy"
        onClick={() => navigate(RouteUrls.Fund)}
      />
      {whenWallet({
        software: (
          <ActionButton
            data-testid={''}
            icon={<SwapIcon />}
            label="Swap"
            onClick={() => navigate(RouteUrls.Swap)}
          />
        ),
        ledger: null,
      })}
    </Flex>
  );
}
