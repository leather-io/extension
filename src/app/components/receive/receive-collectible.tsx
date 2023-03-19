import toast from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Stack, useClipboard } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { Flag } from '@app/components/layout/flag';
import { Caption } from '@app/components/typography';
import { useZeroIndexTaprootAddress } from '@app/query/bitcoin/ordinals/use-zero-index-taproot-address';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function ReceiveCollectible() {
  const analytics = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();
  const accountIndex = get(location.state, 'accountIndex', undefined);
  const btcAddress = useZeroIndexTaprootAddress(accountIndex);

  // TODO: Reuse later for privacy mode
  // const { isLoading, isError, data: btcAddress } = useNextFreshTaprootAddressQuery(accountIndex);

  const stxAddress = useCurrentAccountStxAddressState();
  const { onCopy: onCopyStacks } = useClipboard(stxAddress);

  function copyToClipboard(copyHandler: () => void) {
    void analytics.track('select_nft_to_add_new_collectible');
    toast.success('Copied to clipboard!');
    copyHandler();
  }

  if (!btcAddress) return null;

  return (
    <Stack spacing="loose" mt="base" mb="extra-loose">
      <Flag img={<OrdinalIcon />} spacing="base">
        <Flex justifyContent="space-between">
          <Box>
            Ordinal inscription
            <Caption mt="2px">{truncateMiddle(btcAddress, 6)}</Caption>
          </Box>
          <Stack>
            <Box>
              <Button
                borderRadius="10px"
                mode="tertiary"
                onClick={() => {
                  void analytics.track('select_inscription_to_add_new_collectible');
                  navigate(RouteUrls.ReceiveCollectibleOrdinal, { state: { btcAddress } });
                }}
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
                onClick={() => {
                  copyToClipboard(onCopyStacks);
                }}
              >
                <FiCopy />
              </Button>
            </Box>
          </Stack>
        </Flex>
      </Flag>
    </Stack>
  );
}
