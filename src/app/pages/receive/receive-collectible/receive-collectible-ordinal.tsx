import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiArrowUpRight } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex, Stack, color, useClipboard } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBackgroundLocationRedirect } from '@app/common/hooks/use-background-location-redirect';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { ErrorLabel } from '@app/components/error-label';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { Divider } from '@app/components/layout/divider';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption, Text, Title } from '@app/components/typography';

export function ReceiveCollectibleOrdinal() {
  useBackgroundLocationRedirect();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { state } = useLocation();

  const { onCopy } = useClipboard(state?.btcAddressTaproot);

  const copyToClipboard = useCallback(() => {
    void analytics.track('copy_address_to_add_new_inscription');
    toast.success('Copied to clipboard!');
    onCopy();
  }, [analytics, onCopy]);

  return (
    <BaseDrawer isShowing onClose={() => navigate(RouteUrls.Home)}>
      <Box mx="extra-loose">
        <Stack alignItems="center" px={['unset', 'base']} spacing="loose" textAlign="center">
          <OrdinalIcon />
          <Title fontSize="20px" lineHeight="28px" px="extra-loose">
            Deposit Ordinal inscription
          </Title>
          <Text color={color('text-title')} fontSize={1} px={['50px', '70px']}>
            Use your wallet to create inscriptions within minutes on
          </Text>
          <Stack alignItems="center" pb={['unset', 'base']}>
            <Stack
              _hover={{ cursor: 'pointer' }}
              alignItems="center"
              as="button"
              color={color('accent')}
              fontSize={1}
              isInline
              onClick={() => {
                void analytics.track('go_to_create_ordinal_on_gamma');
                openInNewTab('https://gamma.io/ordinals');
              }}
              spacing="extra-tight"
              textDecoration="underline"
              type="button"
            >
              <Text color="inherit">Gamma.io</Text>
              <FiArrowUpRight />
            </Stack>
            <Stack
              _hover={{ cursor: 'pointer' }}
              alignItems="center"
              as="button"
              color={color('accent')}
              fontSize={1}
              isInline
              onClick={() => {
                void analytics.track('go_to_create_ordinal_on_ordinalsbot');
                openInNewTab('https://ordinalsbot.com/');
              }}
              spacing="extra-tight"
              textDecoration="underline"
              type="button"
            >
              <Text color="inherit">ordinalsbot.com</Text>
              <FiArrowUpRight />
            </Stack>
          </Stack>
          <Divider />
          <ErrorLabel mt={['unset', 'base']}>Important to keep in mind</ErrorLabel>
          <Text color={color('text-title')} fontSize={1} px={['unset', 'loose']}>
            This Taproot address is for Ordinals only. Do not deposit other BTC here or you may have
            difficulty retrieving it
          </Text>
          <Flex sx={{ maxWidth: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Caption mt="2px">{truncateMiddle(state?.btcAddressTaproot, 6)}</Caption>
          </Flex>
        </Stack>
        <PrimaryButton flexGrow={1} my="extra-loose" onClick={copyToClipboard} width="100%">
          Copy address
        </PrimaryButton>
      </Box>
    </BaseDrawer>
  );
}
