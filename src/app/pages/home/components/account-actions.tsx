import { useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, Flex } from 'leather-styles/jsx';

import { whenStacksChainId } from '@leather.io/stacks';
import { ArrowsRepeatLeftRightIcon, CreditCardIcon, IconButton, InboxIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import {
  useConfigBitcoinEnabled,
  useConfigSwapsEnabled,
} from '@app/query/common/remote-config/remote-config.query';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { SendButton } from './send-button';
import { SwapsDisabledTooltipLabel } from './swaps-disabled-tooltip-label';

export function AccountActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const isBitcoinEnabled = useConfigBitcoinEnabled();
  const stacksAccount = useCurrentStacksAccount();
  const currentBtcSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const btcAccount = currentBtcSigner?.address;
  const currentNetwork = useCurrentNetwork();
  const { isTestnet } = useCurrentNetworkState();

  const swapsEnabled = useConfigSwapsEnabled();
  const swapsBtnDisabled = !swapsEnabled || !stacksAccount || isTestnet;

  const receivePath = isBitcoinEnabled
    ? RouteUrls.Receive
    : `${RouteUrls.Home}${RouteUrls.ReceiveStx}`;

  return (
    <Flex gap={{ base: 'space.01', md: 'space.04' }} py="space.04" justifyContent="space-between">
      <SendButton />
      <IconButton
        data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
        icon={<InboxIcon />}
        label="Receive"
        onClick={() => navigate(receivePath, { state: { backgroundLocation: location } })}
      />

      {(!!stacksAccount || !!btcAccount) && (
        <IconButton
          data-testid={HomePageSelectors.FundAccountBtn}
          icon={<CreditCardIcon />}
          label="Buy"
          onClick={() => navigate(RouteUrls.FundChooseCurrency)}
        />
      )}
      {whenStacksChainId(currentNetwork.chain.stacks.chainId)({
        [ChainID.Mainnet]: (
          <BasicTooltip
            label={swapsEnabled ? '' : <SwapsDisabledTooltipLabel />}
            side="left"
            asChild
          >
            <Box display="flex">
              <IconButton
                data-testid={HomePageSelectors.SwapBtn}
                disabled={swapsBtnDisabled}
                icon={<ArrowsRepeatLeftRightIcon />}
                label="Swap"
                onClick={() =>
                  navigate(RouteUrls.Swap.replace(':base', 'STX').replace(':quote', ''))
                }
              />
            </Box>
          </BasicTooltip>
        ),
        // Temporary for sBTC testing
        [ChainID.Testnet]: (
          <IconButton
            data-testid={HomePageSelectors.SwapBtn}
            disabled={swapsBtnDisabled}
            icon={<ArrowsRepeatLeftRightIcon />}
            label="Swap"
            onClick={() => navigate(RouteUrls.Swap.replace(':base', 'STX').replace(':quote', ''))}
          />
        ),
      })}
    </Flex>
  );
}
