import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { Box, Flex, useClipboard, Stack, color, Button } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { useWallet } from '@app/common/hooks/use-wallet';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';

import { Caption, Text, Title } from '@app/components/typography';

import { getAccountDisplayName } from '@app/common/utils/get-account-display-name';

import { QrCode } from './components/address-qr-code';
import { BaseDrawer } from '@app/components/drawer/base-drawer';

export const ReceiveTokens = () => {
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const navigate = useNavigate();
  const address = currentAccountStxAddress || '';
  const analytics = useAnalytics();
  const { onCopy } = useClipboard(address);

  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    toast.success('Copied to clipboard!');
    onCopy();
  };

  return (
    <BaseDrawer title="Receive" isShowing onClose={() => navigate(-1)}>
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
        <Text color={color('text-caption')} mb="tight" textAlign="left">
          Share your account’s unique address to receive any token or collectible. Including a memo
          is not required.
        </Text>
        <Box mt="extra-loose" mx="auto">
          <QrCode principal={address} />
        </Box>
        <Stack alignItems="center" spacing="base">
          {currentAccount && (
            <Title fontSize={3} lineHeight="1rem" mt="loose">
              {getAccountDisplayName(currentAccount)}
            </Title>
          )}
          <Caption userSelect="none">{truncateMiddle(address, 4)}</Caption>
          <Button
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
            borderRadius="10px"
            boxShadow="none"
            height="40px"
            mode="tertiary"
            onClick={copyToClipboard}
          >
            <FiCopy />
            <Text ml="tight">Copy address</Text>
          </Button>
        </Stack>
      </Flex>
    </BaseDrawer>
  );
};
