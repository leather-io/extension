import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { HamburgerIcon } from '@leather.io/ui';

import { Settings } from '../../../settings/settings';
import { ContainerLayout } from '../container.layout';
import { PageProvider } from './page.context';
import { PageHeader } from './page.header';

interface PageLayoutProps {
  children?: React.JSX.Element | React.JSX.Element[];
  isShowingSwitchAccount?: boolean;
  setIsShowingSwitchAccount?(isShowingSwitchAccount: boolean): void;
}
export function PageLayout({
  children,
  isShowingSwitchAccount,
  setIsShowingSwitchAccount,
}: PageLayoutProps) {
  console.log('render PageLayout');
  return (
    <PageProvider>
      <ContainerLayout
        header={
          <PageHeader
            settingsMenu={
              setIsShowingSwitchAccount && (
                <Settings
                  triggerButton={<HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
                  toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                />
              )
            }
          />
        }
        content={children}
      />
    </PageProvider>
  );
}
