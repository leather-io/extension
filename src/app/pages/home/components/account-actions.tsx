import { useNavigate } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Flex, FlexProps } from 'leather-styles/jsx';

// import { SWAP_ENABLED } from '@shared/environment';
import { RouteUrls } from '@shared/route-urls';

import { ArrowDown } from '@app/components/icons/arrow-down';
import { Plus2 } from '@app/components/icons/plus2';
import { SwapIcon } from '@app/components/icons/swap-icon';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';

import { ActionButton } from './action-button';
import { SendButton } from './send-button';

export function AccountActions(props: FlexProps) {
  const navigate = useNavigate();
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  return (
    <Flex justify="space-between" {...props}>
      <SendButton />

      <ActionButton
        data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
        icon={<ArrowDown />}
        label="Receive"
        onClick={() => navigate(isBitcoinEnabled ? RouteUrls.Receive : RouteUrls.ReceiveStx)}
      />
      <ActionButton
        data-testid={HomePageSelectors.FundAccountBtn}
        icon={<Plus2 />}
        label="Buy"
        onClick={() => navigate(RouteUrls.Fund)}
      />
      {/* !!!IMPORTANT!!! */}
      {/* TODO: Hide swap button before merging, use SWAP_ENABLED flag */}
      <ActionButton
        data-testid={''}
        icon={<SwapIcon />}
        label="Swap"
        onClick={() => navigate(RouteUrls.Swap)}
      />
    </Flex>
  );
}
