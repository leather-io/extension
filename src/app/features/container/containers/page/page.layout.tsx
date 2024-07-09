import { Outlet } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { HamburgerIcon } from '@leather.io/ui';

import { Settings } from '../../../settings/settings';
import { ContainerLayout } from '../container.layout';
import { PageProvider } from './page.context';
import { PageHeader } from './page.header';

interface PageLayoutProps {
  isShowingSwitchAccount?: boolean;
  setIsShowingSwitchAccount?(isShowingSwitchAccount: boolean): void;
}
export function PageLayout({ isShowingSwitchAccount, setIsShowingSwitchAccount }: PageLayoutProps) {
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
