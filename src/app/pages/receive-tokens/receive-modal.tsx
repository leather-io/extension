import toast from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Stack, useClipboard } from '@stacks/ui';
import { color, truncateMiddle } from '@stacks/ui-utils';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { QrCodeIcon } from '@app/components/qr-code-icon';
import { Body, Caption } from '@app/components/typography';
import { useCurrentBtcAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function ReceiveModal() {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const btcAddress = useCurrentBtcAccountAddressIndexZero();
  const { onCopy: onCopyBitcoin } = useClipboard(btcAddress);

  const stxAddress = useCurrentAccountStxAddressState();
  const { onCopy: onCopyStacks } = useClipboard(stxAddress);

  function copyToClipboard(copyHandler: () => void) {
    void analytics.track('copy_address_to_clipboard');
    toast.success('Copied to clipboard!');
    copyHandler();
  }
  return (
    <BaseDrawer title="Select asset to receive" isShowing onClose={() => navigate('../')}>
      <Box mx="extra-loose">
        <Body>Share your account's unique address to receive any token or collectible</Body>
        <Stack spacing="loose" mt="loose" mb="extra-loose">
          <Flag img={<BtcIcon />} spacing="base">
            <Flex justifyContent="space-between">
              <Box>
                Bitcoin
                <Caption mt="2px">{truncateMiddle(btcAddress, 6)}</Caption>
              </Box>
              <Stack>
                <Box>
                  <Button
                    borderRadius="10px"
                    mode="tertiary"
                    mr="tight"
                    onClick={() => copyToClipboard(onCopyBitcoin)}
                  >
                    <FiCopy />
                  </Button>
                  <Button
                    borderRadius="10px"
                    data-testId={HomePageSelectors.ReceiveBtcQrCodeBtn}
                    mode="tertiary"
                    onClick={() => navigate(RouteUrls.ReceiveBtc)}
                  >
                    <Box color={color('text-caption')} size="14px">
                      <QrCodeIcon />
                    </Box>
                  </Button>
                </Box>
              </Stack>
            </Flex>
          </Flag>
          <Flag img={<StxAvatar />} spacing="base">
            <Flex justifyContent="space-between">
              <Box>
                Stacks
                <Caption mt="2px">{truncateMiddle(stxAddress, 6)}</Caption>
              </Box>
              <Stack>
                <Box>
                  <Button
                    borderRadius="10px"
                    mode="tertiary"
                    mr="tight"
                    onClick={() => copyToClipboard(onCopyStacks)}
                  >
                    <FiCopy />
                  </Button>
                  <Button
                    borderRadius="10px"
                    data-testId={HomePageSelectors.ReceiveStxQrCodeBtn}
                    mode="tertiary"
                    onClick={() => navigate(RouteUrls.ReceiveStx)}
                  >
                    <Box color={color('text-caption')} size="14px">
                      <QrCodeIcon />
                    </Box>
                  </Button>
                </Box>
              </Stack>
            </Flex>
          </Flag>
        </Stack>
      </Box>
    </BaseDrawer>
  );
}
