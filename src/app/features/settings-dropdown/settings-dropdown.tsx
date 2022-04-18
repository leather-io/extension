import { memo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, SlideFade, BoxProps, color, Flex } from '@stacks/ui';

import { Text, Caption } from '@app/components/typography';
import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { RouteUrls } from '@shared/route-urls';
import { Divider } from '@app/components/divider';
import { forwardRefWithAs } from '@stacks/ui-core';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useHasCreatedAccount } from '@app/store/accounts/account.hooks';
import { Overlay } from '@app/components/overlay';

const MenuWrapper = forwardRefWithAs((props, ref) => (
  <Box
    ref={ref}
    position="absolute"
    top="60px"
    right="extra-loose"
    borderRadius="10px"
    width="296px"
    boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
    zIndex={2000}
    border="1px solid"
    bg={color('bg')}
    borderColor={color('border')}
    py="tight"
    transformOrigin="top right"
    {...props}
  />
));

const MenuItem = memo((props: BoxProps) => {
  const { onClick, children, ...rest } = props;
  return (
    <Text
      width="100%"
      px="base"
      py="base-tight"
      cursor="pointer"
      color={color('text-title')}
      _hover={{ backgroundColor: color('bg-4') }}
      onClick={e => {
        onClick?.(e);
      }}
      fontSize={1}
      {...rest}
    >
      {children}
    </Text>
  );
});

export const SettingsDropdown = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { lockWallet, wallet, currentNetworkKey, hasGeneratedWallet, encryptedSecretKey } =
    useWallet();
  const createAccount = useCreateAccount();
  const [hasCreatedAccount, setHasCreatedAccount] = useHasCreatedAccount();
  const {
    setShowNetworks,
    setShowSwitchAccountsState,
    setShowSettings,
    showSettings,
    setShowSignOut,
  } = useDrawers();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  const handleClose = useCallback(() => {
    setShowSettings(false);
  }, [setShowSettings]);

  const wrappedCloseCallback = useCallback(
    (callback: () => void) => () => {
      callback();
      handleClose();
    },
    [handleClose]
  );

  const isShowing = showSettings;

  useOnClickOutside(ref, isShowing ? handleClose : null);

  return (
    <>
      {hasCreatedAccount && <Overlay />}
      <SlideFade initialOffset="-20px" timeout={150} in={isShowing}>
        {styles => (
          <MenuWrapper ref={ref} style={styles} pointerEvents={!isShowing ? 'none' : 'all'}>
            {hasGeneratedWallet && (
              <>
                {wallet && wallet?.accounts?.length > 1 && (
                  <MenuItem
                    data-testid={SettingsSelectors.SwitchAccount}
                    onClick={wrappedCloseCallback(() => {
                      setShowSwitchAccountsState(true);
                    })}
                  >
                    Switch account
                  </MenuItem>
                )}
                <MenuItem
                  data-testid={SettingsSelectors.CreateAccountBtn}
                  onClick={wrappedCloseCallback(() => {
                    void createAccount();
                    setHasCreatedAccount(true);
                  })}
                >
                  Create an Account
                </MenuItem>
                <MenuItem
                  data-testid={SettingsSelectors.ViewSecretKeyListItem}
                  onClick={wrappedCloseCallback(() => {
                    navigate(RouteUrls.ViewSecretKey);
                  })}
                >
                  View Secret Key
                </MenuItem>
              </>
            )}
            {hasGeneratedWallet ? <Divider /> : null}
            <MenuItem
              data-testid={SettingsSelectors.ChangeNetworkAction}
              onClick={wrappedCloseCallback(() => {
                void analytics.track('choose_to_change_network');
                setShowNetworks(true);
              })}
            >
              <Flex width="100%" alignItems="center" justifyContent="space-between">
                <Box>Change Network</Box>
                <Caption data-testid={SettingsSelectors.CurrentNetwork}>
                  {currentNetworkKey}
                </Caption>
              </Flex>
            </MenuItem>
            {encryptedSecretKey && (
              <>
                <Divider />
                {hasGeneratedWallet && (
                  <MenuItem
                    onClick={wrappedCloseCallback(() => {
                      void analytics.track('lock_session');
                      void lockWallet();
                      navigate(RouteUrls.Unlock);
                    })}
                    data-testid="settings-lock"
                  >
                    Lock
                  </MenuItem>
                )}
                <MenuItem
                  color={color('feedback-error')}
                  onClick={wrappedCloseCallback(() => {
                    setShowSignOut(true);
                    navigate(RouteUrls.SignOutConfirm);
                  })}
                  data-testid="settings-sign-out"
                >
                  Sign Out
                </MenuItem>
              </>
            )}
          </MenuWrapper>
        )}
      </SlideFade>
    </>
  );
};
