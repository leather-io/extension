import { createPortal } from 'react-dom';
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
import { ReceiveCollectible } from '@app/components/receive/receive-collectible';
import { Caption } from '@app/components/typography';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

// import Portal from '../../Portal';

export function ReceiveModal() {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const stxAddress = useCurrentAccountStxAddressState();
  const { onCopy: onCopyStacks } = useClipboard(stxAddress);

  function copyToClipboard(copyHandler: () => void) {
    void analytics.track('copy_address_to_clipboard');
    toast.success('Copied to clipboard!');
    copyHandler();
  }

  const newElement = document.createElement('div');
  newElement.id = 'portal';
  document.body.appendChild(newElement);
  const portal = document.getElementById('portal');
  // this works almost
  return createPortal(
    <BaseDrawer title="Select asset to receive" isShowing onClose={() => navigate('../')}>
      <Box mx="extra-loose">
        <Caption style={{ fontSize: '14px' }}>Tokens</Caption>

        <Stack spacing="loose" mt="base" mb="extra-loose">
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
                    data-testid={HomePageSelectors.ReceiveBtcNativeSegwitQrCodeBtn}
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
                    data-testid={HomePageSelectors.ReceiveStxQrCodeBtn}
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
        <Caption style={{ fontSize: '14px' }}>Collectibles</Caption>

        <ReceiveCollectible />
      </Box>
    </BaseDrawer>,
    portal!
  ) as React.JSX.Element;
}
