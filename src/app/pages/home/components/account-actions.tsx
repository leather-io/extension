import { useNavigate } from 'react-router-dom';

import { HomePageSelectorsLegacy } from '@tests-legacy/page-objects/home.selectors';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Flex, FlexProps } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { ArrowDown } from '@app/components/icons/arrow-down';
import { Plus2 } from '@app/components/icons/plus2';
// import { SwapIcon } from '@app/components/icons/swap';
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
        data-testid={HomePageSelectorsLegacy.BtnFundAccount}
        icon={<Plus2 />}
        label="Buy"
        onClick={() => navigate(RouteUrls.Fund)}
      />
      {/* TODO: Use with feature flag */}
      {/* <ActionButton
        data-testid={''}
        icon={<SwapIcon />}
        label="Swap"
        onClick={() => navigate(RouteUrls.Receive)}
      /> */}
    </Flex>
  );
}
