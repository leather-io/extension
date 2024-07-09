import { Outlet, useOutletContext } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { HamburgerIcon } from '@leather.io/ui';

import { SwitchAccountOutletContext } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';

import { Settings } from '../../../settings/settings';
import { ContainerLayout } from '../container.layout';
import { PageProvider } from './page.context';
import { PageHeader } from './page.header';

export function PageLayout() {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } =
    useOutletContext<SwitchAccountOutletContext>();

  // PETE is it better to just instead useOutletContext to update the state via reducer?
  // try a simple example with title

  // PETE - check if changing from children to Outlet stops memory leak
  console.log('render PageLayout');
  return (
    <PageProvider>
      <ContainerLayout
        header={
          <PageHeader
            settingsMenu={
              //  need to fix the display of this
              setIsShowingSwitchAccount && (
                <Settings
                  triggerButton={<HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
                  toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                />
              )
            }
          />
        }
        content={<Outlet />}
      />
    </PageProvider>
  );
}
