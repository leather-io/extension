import React from 'react';
import { Box, Text, Button, useClipboard } from '@blockstack/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { Toast } from '@components/toast';
import QRCode from 'qrcode.react';

export const PopupReceive: React.FC = () => {
  const { doChangeScreen } = useAnalytics();
  const address = 'STEQ5X9YDTA5S2DMSAD56S0W3K3Y24Y06Z066SKA';
  const { onCopy, hasCopied } = useClipboard(address);
  return (
    <PopupContainer title="Receive" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)}>
      <Toast show={hasCopied} />
      <Box mt="extra-loose" textAlign="center" mx="auto">
        <QRCode value={address} />
      </Box>
      <Box width="100%" mt="extra-loose" textAlign="center">
        <Text fontSize={2} fontWeight="600" lineHeight="40px" display="block">
          markmhendrickson.id
        </Text>
        <Text fontSize={1}>{address}</Text>
      </Box>
      <Box mt="extra-loose">
        <Button width="100%" onClick={onCopy}>
          Copy your address
        </Button>
      </Box>
    </PopupContainer>
  );
};
