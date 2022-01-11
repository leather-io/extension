import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, useClipboard, Stack, Text, color } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { getAccountDisplayName } from '@stacks/wallet-sdk';

import { useWallet } from '@common/hooks/use-wallet';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';
import { Header } from '@components/header';
import { Toast } from '@components/toast';
import { PopupContainer } from '@components/popup/container';
import { Caption, Title } from '@components/typography';
import { Tooltip } from '@components/tooltip';
import { RouteUrls } from '@routes/route-urls';

import { QrCode } from './components/address-qr-code';

export const ReceiveTokens: React.FC = () => {
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const navigate = useNavigate();
  const address = currentAccountStxAddress || '';
  const analytics = useAnalytics();
  const { onCopy, hasCopied } = useClipboard(address);
  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    onCopy();
  };

  return (
    <PopupContainer header={<Header title="Receive" onClose={() => navigate(RouteUrls.Home)} />}>
      <Stack spacing="loose" textAlign="center">
        <Text
          textStyle="body.small"
          color={color('text-caption')}
          textAlign={['left', 'left', 'center']}
        >
          Share your unique address to receive any token or collectible. Including a memo is not
          required.
        </Text>
        <Toast show={hasCopied} />
        <Box mx="auto">
          <QrCode principal={address} />
        </Box>
        {currentAccount && (
          <Title fontSize={3} lineHeight="1rem">
            {getAccountDisplayName(currentAccount)}
          </Title>
        )}
        <Box>
          <Tooltip interactive placement="bottom" label={address}>
            <Caption userSelect="none">{truncateMiddle(address, 4)}</Caption>
          </Tooltip>
        </Box>
        <Button width="100%" onClick={copyToClipboard} borderRadius="10px">
          Copy your address
        </Button>
      </Stack>
    </PopupContainer>
  );
};
