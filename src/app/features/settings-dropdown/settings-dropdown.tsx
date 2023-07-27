import { useCallback, useRef } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex, SlideFade, Stack, color } from '@stacks/ui';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';
import { SettingsMenuSelectors } from '@tests/selectors/settings.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useModifierKey } from '@app/common/hooks/use-modifier-key';
import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openInNewTab, openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { Divider } from '@app/components/layout/divider';
import { Overlay } from '@app/components/overlay';
import { Caption } from '@app/components/typography';
import { useHasCreatedAccount } from '@app/store/accounts/account';
import {
  useCurrentStacksAccount,
  useStacksAccounts,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentKeyDetails } from '@app/store/keys/key.selectors';
import { useCurrentNetworkId } from '@app/store/networks/networks.selectors';

import { extractDeviceNameFromKnownTargetIds } from '../ledger/utils/generic-ledger-utils';
import { AdvancedMenuItems } from './components/advanced-menu-items';
import { LedgerDeviceItemRow } from './components/ledger-item-row';
import { SettingsMenuItem as MenuItem } from './components/settings-menu-item';
import { MenuWrapper } from './components/settings-menu-wrapper';

export function SettingsDropdown() {
  const ref = useRef<HTMLDivElement | null>(null);
  const hasGeneratedWallet = !!useCurrentStacksAccount();
  const stacksAccounts = useStacksAccounts();
  const { lockWallet } = useKeyActions();
  const [hasCreatedAccount] = useHasCreatedAccount();
  const { setIsShowingSettings, isShowingSettings, setIsShowingSwitchAccountsState } = useDrawers();
  const currentNetworkId = useCurrentNetworkId();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const key = useCurrentKeyDetails();
  const { isPressed: showAdvancedMenuOptions } = useModifierKey('alt', 120);
  const location = useLocation();

  const handleClose = useCallback(() => setIsShowingSettings(false), [setIsShowingSettings]);

  const wrappedCloseCallback = useCallback(
    (callback: () => void) => () => {
      callback();
      handleClose();
    },
    [handleClose]
  );

  const isShowing = isShowingSettings;

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
            {stacksAccounts && (
              <MenuItem
                data-testid={SettingsMenuSelectors.SwitchAccountMenuItem}
                onClick={wrappedCloseCallback(() => setIsShowingSwitchAccountsState(true))}
              >
                Switch account
              </MenuItem>
            )}
            {hasGeneratedWallet && walletType === 'software' && (
              <>
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
            <MenuItem
              data-testid={SettingsSelectors.ToggleTheme}
              onClick={wrappedCloseCallback(() => {
                void analytics.track('click_change_theme_menu_item');
                navigate(RouteUrls.ChangeTheme, {
                  state: { backgroundLocation: location },
                });
              })}
            >
              Change theme
            </MenuItem>
            {whenPageMode({
              full: null,
              popup: (
                <MenuItem
                  data-testid={SettingsMenuSelectors.OpenWalletInNewTab}
                  onClick={() => {
                    void analytics.track('click_open_in_new_tab_menu_item');
                    openIndexPageInNewTab(location.pathname);
                  }}
                >
                  <Stack isInline>
                    <Box>Open in new tab</Box>
                    <FiExternalLink />
                  </Stack>
                </MenuItem>
              ),
            })}
            <MenuItem
              data-testid={SettingsMenuSelectors.GetSupportMenuItem}
              onClick={wrappedCloseCallback(() => {
                void analytics.track('click_get_support_menu_item');
                openInNewTab(
                  'https://wallet.hiro.so/wallet-faq/where-can-i-find-support-for-the-stacks-wallet'
                );
              })}
            >
              <Stack isInline>
                <Box>Get support</Box>
                <FiExternalLink />
              </Stack>
            </MenuItem>
            <MenuItem
              onClick={wrappedCloseCallback(() => {
                void analytics.track('click_request_feature_menu_item');
                openInNewTab('https://hirowallet.canny.io/feature-requests');
              })}
            >
              <Stack isInline>
                <Box>Request feature</Box>
                <FiExternalLink />
              </Stack>
            </MenuItem>
            {hasGeneratedWallet ? <Divider /> : null}
            <MenuItem
              data-testid={SettingsSelectors.ChangeNetworkAction}
              onClick={wrappedCloseCallback(() => {
                void analytics.track('click_change_network_menu_item');
                navigate(RouteUrls.SelectNetwork, {
                  state: { backgroundLocation: location },
                });
              })}
            >
              <Flex width="100%" alignItems="center" justifyContent="space-between">
                <Box>Change network</Box>
                <Caption data-testid={SettingsSelectors.CurrentNetwork}>{currentNetworkId}</Caption>
              </Flex>
            </MenuItem>

            <Divider />
            {showAdvancedMenuOptions && (
              <AdvancedMenuItems
                closeHandler={wrappedCloseCallback}
                settingsShown={isShowingSettings}
              />
            )}
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
              onClick={wrappedCloseCallback(() =>
                navigate(RouteUrls.SignOutConfirm, {
                  state: { backgroundLocation: location },
                })
              )}
              data-testid="settings-sign-out"
            >
              Sign out
            </MenuItem>
          </MenuWrapper>
        )}
      </SlideFade>
    </>
  );
}
