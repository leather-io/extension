import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { BarsTwoIcon } from '@leather.io/ui';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { whenPageMode } from '@app/common/utils';
import { FullScreenButton } from '@app/components/full-screen-button';
import { Header } from '@app/components/layout/headers/header';
import { HeaderGrid, HeaderGridRightCol } from '@app/components/layout/headers/header-grid';
import { LogoBox } from '@app/components/layout/headers/logo-box';
import { Settings } from '@app/features/settings/settings';

export function HomeHeader() {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } = useSwitchAccountSheet();

  return (
    <Header>
      <HeaderGrid
        leftCol={<LogoBox hideBelow={undefined} />}
        rightCol={
          <HeaderGridRightCol>
            {whenPageMode({ full: null, popup: <FullScreenButton /> })}
            <Settings
              triggerButton={<BarsTwoIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
              toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
            />
          </HeaderGridRightCol>
        }
      />
    </Header>
  );
}
