import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, SlideFade, color, Flex } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { RouteUrls } from '@shared/route-urls';
import { Divider } from '@app/components/divider';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useHasCreatedAccount } from '@app/store/accounts/account.hooks';
import { Overlay } from '@app/components/overlay';
import { SettingsMenuItem as MenuItem } from './components/settings-menu-item';
import { MenuWrapper } from './components/settings-menu-wrapper';
import { useWalletType } from '@app/common/use-wallet-type';
import { LedgerDeviceItemRow } from './components/ledger-item-row';
import { useCurrentKeyDetails } from '@app/store/keys/key.selectors';
import { extractDeviceNameFromKnownTargetIds } from '../ledger/ledger-utils';

export function SettingsDropdown() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { lockWallet, currentNetworkKey, hasGeneratedWallet, wallet } = useWallet();
  const createAccount = useCreateAccount();
  const [hasCreatedAccount, setHasCreatedAccount] = useHasCreatedAccount();
  const {
    setShowNetworks,
    setShowSettings,
    showSettings,
    setShowSignOut,
    setShowSwitchAccountsState,
  } = useDrawers();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const key = useCurrentKeyDetails();

  const handleClose = useCallback(() => setShowSettings(false), [setShowSettings]);

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
            {key && key.type === 'ledger' && (
              <LedgerDeviceItemRow deviceType={extractDeviceNameFromKnownTargetIds(key.targetId)} />
            )}
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
            {hasGeneratedWallet && walletType === 'software' && (
              <>
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
            <Divider />
            {hasGeneratedWallet && walletType === 'software' && (
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
          </MenuWrapper>
        )}
      </SlideFade>
    </>
  );
}
