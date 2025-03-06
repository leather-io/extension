import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { css } from 'leather-styles/css';
import { Flex, Stack, styled } from 'leather-styles/jsx';

import {
  ArrowsRepeatLeftRightIcon,
  BellAlarmIcon,
  BellIcon,
  Caption,
  DropdownMenu,
  ExitIcon,
  ExpandIcon,
  ExternalLinkIcon,
  Eye1ClosedIcon,
  Eye1Icon,
  Flag,
  GlobeTiltedIcon,
  KeyIcon,
  LockIcon,
  MegaphoneIcon,
  SunInCloudIcon,
  SupportIcon,
} from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics, openFeedbackSheet } from '@shared/utils/analytics';

import { useHasKeys } from '@app/common/hooks/auth/use-has-keys';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useModifierKey } from '@app/common/hooks/use-modifier-key';
import { useWalletType } from '@app/common/use-wallet-type';
import { truncateString } from '@app/common/utils';
import { openInNewTab, openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { AppVersion } from '@app/components/app-version';
import { Divider } from '@app/components/layout/divider';
import { NetworkSheet } from '@app/features/settings/network/network';
import { SignOut } from '@app/features/settings/sign-out/sign-out-confirm';
import { ThemeSheet } from '@app/features/settings/theme/theme-dialog';
import { useLedgerDeviceTargetId } from '@app/store/ledger/ledger.selectors';
import { useCurrentNetworkId } from '@app/store/networks/networks.selectors';
import {
  useToggleNotificationsEnabled,
  useTogglePrivateMode,
} from '@app/store/settings/settings.actions';
import {
  useIsNotificationsEnabled,
  useIsPrivateMode,
} from '@app/store/settings/settings.selectors';

import { extractDeviceNameFromKnownTargetIds } from '../ledger/utils/generic-ledger-utils';
import { useToast } from '../toasts/use-toast';
import { AdvancedMenuItems } from './components/advanced-menu-items';
import { LedgerDeviceItemRow } from './components/ledger-item-row';

interface SettingsProps {
  canLockWallet?: boolean;
  triggerButton: React.ReactNode;
  toggleSwitchAccount?(): void;
}
export function Settings({
  canLockWallet = true,
  triggerButton,
  toggleSwitchAccount,
}: SettingsProps) {
  const [showSignOut, setShowSignOut] = useState(false);
  const [showChangeTheme, setShowChangeTheme] = useState(false);
  const [showChangeNetwork, setShowChangeNetwork] = useState(false);

  const { hasKeys, hasLedgerKeys } = useHasKeys();

  const { lockWallet } = useKeyActions();

  const currentNetworkId = useCurrentNetworkId();
  const navigate = useNavigate();

  const { walletType } = useWalletType();
  const targetId = useLedgerDeviceTargetId();

  const isPrivateMode = useIsPrivateMode();
  const togglePrivateMode = useTogglePrivateMode();

  const isNotificationsEnabled = useIsNotificationsEnabled();
  const toggleNotificationsEnabled = useToggleNotificationsEnabled();

  const location = useLocation();

  const { isPressed: showAdvancedMenuOptions } = useModifierKey('alt', 120);

  const toast = useToast();

  const bottomGroupItems = useMemo(
    () =>
      [
        showAdvancedMenuOptions && <AdvancedMenuItems />,
        canLockWallet && hasKeys && walletType === 'software' && (
          <DropdownMenu.Item
            onSelect={() => {
              void analytics.track('lock_session');
              void lockWallet();
              navigate(RouteUrls.Unlock);
            }}
            data-testid={SettingsSelectors.LockListItem}
          >
            <Flag img={<LockIcon />} textStyle="label.02">
              Lock
            </Flag>
          </DropdownMenu.Item>
        ),

        hasKeys && (
          <DropdownMenu.Item
            onSelect={() => setShowSignOut(!showSignOut)}
            data-testid={SettingsSelectors.SignOutListItem}
          >
            <Flag color="red.action-primary-default" img={<ExitIcon />} textStyle="label.02">
              Sign out
            </Flag>
          </DropdownMenu.Item>
        ),
      ].filter(Boolean),
    [canLockWallet, hasKeys, lockWallet, navigate, showAdvancedMenuOptions, showSignOut, walletType]
  );

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.IconButton>{triggerButton}</DropdownMenu.IconButton>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            side="bottom"
            sideOffset={8}
            className={css({
              width: 'settingsMenuWidth',
              maxHeight: 'var(--radix-dropdown-menu-content-available-height)',
              overflowY: 'scroll',
            })}
          >
            <DropdownMenu.Group>
              {hasLedgerKeys && targetId && (
                <DropdownMenu.Item>
                  <LedgerDeviceItemRow deviceType={extractDeviceNameFromKnownTargetIds(targetId)} />
                </DropdownMenu.Item>
              )}
              {hasKeys && toggleSwitchAccount && (
                <DropdownMenu.Item
                  data-testid={SettingsSelectors.SwitchAccountTrigger}
                  onSelect={toggleSwitchAccount}
                >
                  <Flag img={<ArrowsRepeatLeftRightIcon />} textStyle="label.02">
                    Switch account
                  </Flag>
                </DropdownMenu.Item>
              )}
              {hasKeys && walletType === 'software' && (
                <DropdownMenu.Item
                  data-testid={SettingsSelectors.ViewSecretKeyListItem}
                  onSelect={() => navigate(RouteUrls.ViewSecretKey)}
                >
                  <Flag img={<KeyIcon />} textStyle="label.02">
                    View Secret Key
                  </Flag>
                </DropdownMenu.Item>
              )}
              <styled.div hideFrom="md">
                <DropdownMenu.Item
                  data-testid={SettingsSelectors.OpenWalletInNewTab}
                  onSelect={() => {
                    void analytics.track('click_open_in_new_tab_menu_item');
                    openIndexPageInNewTab(location.pathname);
                  }}
                >
                  <Flag img={<ExpandIcon />} textStyle="label.02">
                    Maximize
                  </Flag>
                </DropdownMenu.Item>
              </styled.div>

              <DropdownMenu.Item
                data-testid={SettingsSelectors.ChangeNetworkAction}
                onSelect={() => {
                  void analytics.track('click_change_network_menu_item');
                  setShowChangeNetwork(!showChangeNetwork);
                }}
              >
                <Flag img={<GlobeTiltedIcon />}>
                  <Stack gap="space.00">
                    <styled.span textStyle="label.02">Change network</styled.span>
                    <Caption data-testid={SettingsSelectors.CurrentNetwork}>
                      {truncateString(currentNetworkId.toString(), 15)}
                    </Caption>
                  </Stack>
                </Flag>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                data-testid={SettingsSelectors.ToggleTheme}
                onSelect={() => {
                  void analytics.track('click_change_theme_menu_item');
                  setShowChangeTheme(!showChangeTheme);
                }}
              >
                <Flag img={<SunInCloudIcon />}>
                  <Flex justifyContent="space-between" textStyle="label.02">
                    Change theme
                  </Flex>
                </Flag>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                data-testid={SettingsSelectors.TogglePrivacy}
                onSelect={() => {
                  void analytics.track('click_toggle_privacy');
                  togglePrivateMode();
                }}
              >
                <Flag img={isPrivateMode ? <Eye1ClosedIcon /> : <Eye1Icon />}>
                  <Flex justifyContent="space-between" textStyle="label.02">
                    Toggle privacy
                  </Flex>
                </Flag>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                data-testid={SettingsSelectors.ToggleNotifications}
                onSelect={() => {
                  toggleNotificationsEnabled();
                  toast.info(
                    isNotificationsEnabled ? 'Notifications disabled' : 'Notifications enabled'
                  );
                }}
              >
                <Flag img={isNotificationsEnabled ? <BellAlarmIcon /> : <BellIcon />}>
                  <Flex justifyContent="space-between" textStyle="label.02">
                    Toggle notifications
                  </Flex>
                </Flag>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <Divider />
            <DropdownMenu.Group>
              <DropdownMenu.Item
                data-testid={SettingsSelectors.GetSupportMenuItem}
                onSelect={() => {
                  openInNewTab('https://leather.io/support');
                }}
              >
                <Flag img={<SupportIcon />} textStyle="label.02">
                  <Flex justifyContent="space-between">
                    Get support
                    <ExternalLinkIcon variant="small" />
                  </Flex>
                </Flag>
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => openFeedbackSheet()}>
                <Flag img={<MegaphoneIcon />} textStyle="label.02">
                  Give feedback
                </Flag>
              </DropdownMenu.Item>
            </DropdownMenu.Group>

            {bottomGroupItems.length > 0 && (
              <>
                <Divider />
                <DropdownMenu.Group>{...bottomGroupItems}</DropdownMenu.Group>
              </>
            )}

            <AppVersion />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {showSignOut && <SignOut onClose={() => setShowSignOut(!showSignOut)} />}
      {showChangeTheme && <ThemeSheet onClose={() => setShowChangeTheme(!showChangeTheme)} />}
      {showChangeNetwork && (
        <NetworkSheet onClose={() => setShowChangeNetwork(!showChangeNetwork)} />
      )}
    </>
  );
}
