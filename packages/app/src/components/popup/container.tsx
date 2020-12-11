import React, { useState } from 'react';
import { Box, Flex, Text, ArrowIcon } from '@stacks/ui';
import { ConnectIcon } from '@components/icons/connect-icon';
import styled from '@emotion/styled';
import { AccountsDrawer } from '@components/drawer/accounts';
import { NetworksDrawer } from '@components/drawer/networks-drawer';
import { EllipsisIcon } from '@components/icons/ellipsis-icon';
import { SettingsPopover } from './settings-popover';
import { useSetRecoilState } from 'recoil';
import { accountDrawerStep, AccountStep } from '@store/recoil';

const CloseIconContainer = styled(Box)`
  svg {
    height: 12px;
    opacity: 50%;
    margin-top: 10px;
  }
`;

interface PopupHomeProps {
  title?: string;
  onClose?: () => void;
  hideActions?: boolean;
}
export const PopupContainer: React.FC<PopupHomeProps> = ({
  children,
  title,
  onClose,
  hideActions,
}) => {
  const [isShowingSwitchAccount, setShowingSwitchAccount] = useState(false);
  const [isShowingNetworks, setShowingNetworks] = useState(false);
  const [isShowingPopover, setShowingPopover] = useState(false);
  const setAccountDrawerStep = useSetRecoilState(accountDrawerStep);
  const isExtension = EXT_ENV !== 'web';
  return (
    <>
      <AccountsDrawer
        showing={isShowingSwitchAccount}
        close={() => {
          setShowingSwitchAccount(false);
          setAccountDrawerStep(AccountStep.Switch);
        }}
      />
      <NetworksDrawer showing={isShowingNetworks} close={() => setShowingNetworks(false)} />
      <Flex
        minHeight="100vh"
        minWidth={isExtension ? '440px' : undefined}
        maxWidth="100vw"
        background="white"
        p="24px"
        flexWrap="wrap"
        flexDirection="column"
      >
        <Flex width="100%">
          <Box flexGrow={1}>
            {title ? (
              <Text fontSize={4} fontWeight="600">
                {title}
              </Text>
            ) : (
              <ConnectIcon height="16px" />
            )}
          </Box>
          {hideActions ? null : onClose ? (
            <CloseIconContainer>
              <ArrowIcon
                height="16px"
                cursor="pointer"
                onClick={onClose}
                direction={'left' as any}
              />
            </CloseIconContainer>
          ) : (
            <Box cursor="pointer" position="relative">
              <SettingsPopover
                showing={isShowingPopover}
                close={() => setShowingPopover(false)}
                showSwitchAccount={() => {
                  setAccountDrawerStep(AccountStep.Switch);
                  setShowingSwitchAccount(true);
                }}
                showNetworks={() => {
                  setShowingNetworks(true);
                }}
                showAddUsername={() => {
                  setAccountDrawerStep(AccountStep.Username);
                  setShowingSwitchAccount(true);
                }}
                showCreateAccount={() => {
                  setAccountDrawerStep(AccountStep.Create);
                  setShowingSwitchAccount(true);
                }}
              />
              <EllipsisIcon onClick={() => setShowingPopover(true)} />
            </Box>
          )}
        </Flex>
        {children}
      </Flex>
    </>
  );
};
