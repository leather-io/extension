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
    height: 14px;
    opacity: 50%;
    // margin-top: 10px;
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
        minHeight="max(100vh, 400px)"
        minWidth={isExtension ? '440px' : undefined}
        maxWidth="100vw"
        background="white"
        p="24px"
        flexWrap="wrap"
        flexDirection="column"
      >
        {onClose && (
          <Box width="100%" mb="tight">
            <CloseIconContainer>
              <ArrowIcon
                height="18px"
                cursor="pointer"
                onClick={onClose}
                direction={'left' as any}
              />
            </CloseIconContainer>
          </Box>
        )}
        <Flex width="100%">
          <Box flexGrow={1}>
            {title ? (
              <Text
                fontSize={4}
                fontWeight="600"
                textStyle="display.large"
                fontFamily="heading"
                color="ink.1000"
              >
                {title}
              </Text>
            ) : (
              <ConnectIcon height="16px" />
            )}
          </Box>
          {hideActions ? null : (
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
