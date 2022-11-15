import toast from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex, color, useClipboard } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { getAutogeneratedAccountDisplayName } from '@app/common/utils/get-account-display-name';
import { AddressDisplayer } from '@app/components/address-displayer/address-displayer';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { Text, Title } from '@app/components/typography';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { QrCode } from './components/address-qr-code';

export const ReceiveTokens = () => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { onCopy } = useClipboard(currentAccount?.address ?? '');

  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    toast.success('Copied to clipboard!');
    onCopy();
  };

  if (!currentAccount) return null;

  return (
    <BaseDrawer title="Receive" isShowing onClose={() => navigate(-1)}>
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
        <Text color={color('text-caption')} mb="tight" textAlign="left">
          Share your account’s unique address to receive any token or collectible. Including a memo
          is not required.
        </Text>
        <Box mt="extra-loose" mx="auto">
          <QrCode principal={currentAccount.address} />
        </Box>
        <Flex alignItems="center" flexDirection="column">
          {currentAccount && (
            <Title fontSize={3} lineHeight="1rem" mt="loose">
              {getAutogeneratedAccountDisplayName(currentAccount)}
            </Title>
          )}
          <Flex maxWidth="280px" flexWrap="wrap" justifyContent="center" lineHeight={1.8} mt="base">
            <AddressDisplayer address={currentAccount.address} />
          </Flex>
          <Button
            borderRadius="10px"
            height="40px"
            mode="tertiary"
            onClick={copyToClipboard}
            mt="base"
          >
            <FiCopy />
            <Text ml="tight">Copy address</Text>
          </Button>
        </Flex>
      </Flex>
    </BaseDrawer>
  );
};
