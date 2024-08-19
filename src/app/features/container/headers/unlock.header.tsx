import { useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { BarsTwoIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { Header } from '@app/components/layout/headers/header';
import { HeaderGrid, HeaderGridRightCol } from '@app/components/layout/headers/header-grid';
import { LogoBox } from '@app/components/layout/headers/logo-box';
import { Settings } from '@app/features/settings/settings';

export function UnlockHeader() {
  const navigate = useNavigate();

  return (
    <Header>
      <HeaderGrid
        leftCol={
          <LogoBox onClick={() => navigate(RouteUrls.Home)} hideBelow={undefined} hideFrom="sm" />
        }
        rightCol={
          <HeaderGridRightCol>
            <Settings
              canLockWallet={false}
              triggerButton={<BarsTwoIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
            />
          </HeaderGridRightCol>
        }
      />
    </Header>
  );
}
