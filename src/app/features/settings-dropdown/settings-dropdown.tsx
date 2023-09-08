import { useCallback, useRef } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

// #4164 FIXME migrate SlideFade
import { SlideFade } from '@stacks/ui';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Divider, Flex, HStack, Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useModifierKey } from '@app/common/hooks/use-modifier-key';
import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { useWalletType } from '@app/common/use-wallet-type';
import { whenPageMode } from '@app/common/utils';
import { openInNewTab, openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { Caption } from '@app/components/typography';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
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
  const { lockWallet } = useKeyActions();

  const { setIsShowingSettings, isShowingSettings } = useDrawers();
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
    <SlideFade initialOffset="-20px" timeout={150} in={isShowing}>
      {(styles: React.CSSProperties) => (
        <MenuWrapper ref={ref} style={styles} pointerEvents={!isShowing ? 'none' : 'all'}>
          {key && key.type === 'ledger' && (
            <LedgerDeviceItemRow deviceType={extractDeviceNameFromKnownTargetIds(key.targetId)} />
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
              navigate(RouteUrls.ChangeTheme, { relative: 'path' });
            })}
          >
            Change theme
          </MenuItem>
          {whenPageMode({
            full: null,
            popup: (
              <MenuItem
                data-testid={SettingsSelectors.OpenWalletInNewTab}
                onClick={() => {
                  void analytics.track('click_open_in_new_tab_menu_item');
                  openIndexPageInNewTab(location.pathname);
                }}
              >
                <Stack>
                  <Box>Open in new tab</Box>
                  <FiExternalLink />
                </Stack>
              </MenuItem>
            ),
          })}
          <MenuItem
            data-testid={SettingsSelectors.GetSupportMenuItem}
            onClick={wrappedCloseCallback(() => {
              void analytics.track('click_get_support_menu_item');
              openInNewTab('https://leather.gitbook.io/guides/installing/contact-support');
            })}
          >
            <HStack>
              <Box>Get support</Box>
              <FiExternalLink />
            </HStack>
          </MenuItem>
          <MenuItem
            onClick={wrappedCloseCallback(() => {
              void analytics.track('click_request_feature_menu_item');
              openInNewTab('https://leather.canny.io/feature-requests');
            })}
          >
            <HStack>
              <Box>Request feature</Box>
              <FiExternalLink />
            </HStack>
          </MenuItem>
          {hasGeneratedWallet ? <Divider /> : null}
          <MenuItem
            data-testid={SettingsSelectors.ChangeNetworkAction}
            onClick={wrappedCloseCallback(() => {
              void analytics.track('click_change_network_menu_item');
              navigate(RouteUrls.SelectNetwork, { relative: 'path' });
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
            color={token('colors.error')}
            onClick={wrappedCloseCallback(() =>
              navigate(RouteUrls.SignOutConfirm, { relative: 'path' })
            )}
            data-testid={SettingsSelectors.SignOutListItem}
          >
            Sign out
          </MenuItem>
        </MenuWrapper>
      )}
    </SlideFade>
  );
}
