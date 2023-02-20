import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Stack, color, useClipboard } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { ErrorLabel } from '@app/components/error-label';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { PrimaryButton } from '@app/components/primary-button';
import { Text, Title } from '@app/components/typography';

export function ReceiveCollectibleOrdinal() {
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { state } = useLocation();
  const { onCopy } = useClipboard(state.btcAddress);

  function copyToClipboard() {
    void analytics.track('copy_address_to_add_new_inscription');
    toast.success('Copied to clipboard!');
    onCopy();
  }

  return (
    <BaseDrawer isShowing onClose={() => navigate('../')}>
      <Box mx="extra-loose">
        <Stack alignItems="center" px={['unset', 'base']} spacing="loose" textAlign="center">
          <OrdinalIcon />
          <Title fontSize="20px" lineHeight="28px" px="extra-loose">
            Deposit Ordinal inscription
          </Title>
          <ErrorLabel>Important to keep in mind</ErrorLabel>
          <Text color={color('text-title')} fontSize={1} px={['base', '40px']}>
            This Taproot address is for Ordinals only. Do not use this address more than once for
            depositing an inscription
          </Text>
        </Stack>
        <Flex alignItems="center" justifyContent="center" my="extra-loose" width="100%">
          <Button
            borderRadius="10px"
            height="48px"
            mode="tertiary"
            mr="base"
            onClick={() => navigate(RouteUrls.ReceiveCollectible)}
            type="button"
          >
            Go back
          </Button>
          <PrimaryButton flexGrow={1} onClick={copyToClipboard}>
            Proceed to copy address
          </PrimaryButton>
        </Flex>
      </Box>
    </BaseDrawer>
  );
}
