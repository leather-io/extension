import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Stack, color, useClipboard } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { ErrorLabel } from '@app/components/error-label';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { PrimaryButton } from '@app/components/primary-button';
import { Text, Title } from '@app/components/typography';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function ReceiveCollectibleOrdinal() {
  const navigate = useNavigate();
  const analytics = useAnalytics();
  // TODO: Replace with taproot address
  const btcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const { onCopy } = useClipboard(btcAddress);

  function copyToClipboard() {
    void analytics.track('copy_btc_taproot_address_to_clipboard');
    toast.success('Copied to clipboard!');
    onCopy();
  }

  return (
    <BaseDrawer isShowing onClose={() => navigate('../')}>
      <Box mx="extra-loose">
        <Stack alignItems="center" px={['unset', 'base']} spacing="loose" textAlign="center">
          <OrdinalIcon />
          <Title fontSize="20px" lineHeight="28px" px="extra-loose">
            Creating or depositing an Ordinal inscription?
          </Title>
          <ErrorLabel>Important to keep in mind</ErrorLabel>
          <Text color={color('text-title')} fontSize={1}>
            This Taproot address is for Ordinals only
          </Text>
          <Text color={color('text-title')} fontSize={1} px={['base-loose', '50px']}>
            Do not reuse this address once depositing an Ordinal into it or it could get lost
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
