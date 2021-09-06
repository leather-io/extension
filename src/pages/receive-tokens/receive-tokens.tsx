import React from 'react';
import { Box, Button, useClipboard, Stack } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { ScreenPaths } from '@common/types';
import { useWallet } from '@common/hooks/use-wallet';
import { Toast } from '@components/toast';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { Caption, Title } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';
import { Tooltip } from '@components/tooltip';
import { QrCode } from './components/address-qr-code';
import { ReceiveTokensHeader } from './components/recieve-tokens-header';

export const PopupReceive: React.FC = () => {
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const doChangeScreen = useChangeScreen();
  const address = currentAccountStxAddress || '';
  const { onCopy, hasCopied } = useClipboard(address);
  return (
    <PopupContainer
      header={<ReceiveTokensHeader onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)} />}
    >
      <Toast show={hasCopied} />
      <Box mt="extra-loose" textAlign="center" mx="auto">
        <QrCode principal={address} />
      </Box>
      <Stack spacing="base-loose" width="100%" mt="extra-loose" textAlign="center">
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
      </Stack>
      <Box mt="auto">
        <Button width="100%" onClick={onCopy} borderRadius="10px">
          Copy your address
        </Button>
      </Box>
    </PopupContainer>
  );
};
