import toast from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Stack, useClipboard } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { Caption } from '@app/components/typography';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useNextFreshTaprootAddressQuery } from './use-next-fresh-taproot-address';

export function ReceiveCollectible() {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const { isLoading, isError, data: btcAddress } = useNextFreshTaprootAddressQuery();

  const stxAddress = useCurrentAccountStxAddressState();
  const { onCopy: onCopyStacks } = useClipboard(stxAddress);

  function copyToClipboard(copyHandler: () => void) {
    void analytics.track('copy_address_to_clipboard');
    toast.success('Copied to clipboard!');
    copyHandler();
  }

  return (
    <BaseDrawer title="Add collectible" isShowing onClose={() => navigate('../')}>
      <Box mx="extra-loose">
        <Stack spacing="loose" mt="loose" mb="extra-loose">
          <Flag img={<BtcIcon />} spacing="base">
            <Flex justifyContent="space-between">
              <Box>
                Ordinal inscription
                {isLoading ? (
                  <Caption mt="2px">Loading...</Caption>
                ) : (
                  !isError && <Caption mt="2px">{truncateMiddle(btcAddress, 6)}</Caption>
                )}
              </Box>
              <Stack>
                <Box>
                  <Button
                    isDisabled={isLoading || isError}
                    borderRadius="10px"
                    mode="tertiary"
                    onClick={() =>
                      navigate(RouteUrls.ReceiveCollectibleOrdinal, { state: { btcAddress } })
                    }
                  >
                    <FiCopy />
                  </Button>
                </Box>
              </Stack>
            </Flex>
          </Flag>
          <Flag img={<StxAvatar />} spacing="base">
            <Flex justifyContent="space-between">
              <Box>
                Stacks NFT
                <Caption mt="2px">{truncateMiddle(stxAddress, 6)}</Caption>
              </Box>
              <Stack>
                <Box>
                  <Button
                    borderRadius="10px"
                    mode="tertiary"
                    onClick={() => copyToClipboard(onCopyStacks)}
                  >
                    <FiCopy />
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
