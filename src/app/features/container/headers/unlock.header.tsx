import { useNavigate, useOutletContext } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { HamburgerIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { SwitchAccountOutletContext } from '@shared/switch-account';

import { Header } from '@app/components/layout/headers/header';
import { HeaderGrid, HeaderGridRightCol } from '@app/components/layout/headers/header-grid';
import { LogoBox } from '@app/components/layout/headers/logo-box';
import { Settings } from '@app/features/settings/settings';

export function UnlockHeader() {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } =
    useOutletContext<SwitchAccountOutletContext>();
  const navigate = useNavigate();

  return (
    <Header paddingLeft={{ base: undefined, sm: 0 }}>
      <HeaderGrid
        leftCol={
          <LogoBox onClick={() => navigate(RouteUrls.Home)} hideBelow={undefined} hideFrom="sm" />
        }
        rightCol={
          <HeaderGridRightCol>
            <Settings
              triggerButton={<HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
              toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
            />
          </HeaderGridRightCol>
        }
      />
    </Header>
  );
}
