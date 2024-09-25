import { useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { ArrowLeftIcon, BarsTwoIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { Header } from '@app/components/layout/headers/header';
import { HeaderActionButton } from '@app/components/layout/headers/header-action-button';
import { HeaderGrid, HeaderGridRightCol } from '@app/components/layout/headers/header-grid';
import { LogoBox } from '@app/components/layout/headers/logo-box';
import { Settings } from '@app/features/settings/settings';

interface OnboardingHeaderProps {
  hideLogo?: boolean;
}

export function OnboardingHeader({ hideLogo = false }: OnboardingHeaderProps) {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } = useSwitchAccountSheet();
  const navigate = useNavigate();

  return (
    <Header px="space.05">
      <HeaderGrid
        leftCol={
          <>
            <HeaderActionButton
              icon={<ArrowLeftIcon />}
              onAction={() => navigate(-1)}
              dataTestId={SharedComponentsSelectors.HeaderBackBtn}
            />
            {!hideLogo && <LogoBox onClick={() => navigate(RouteUrls.Home)} />}
          </>
        }
        rightCol={
          <HeaderGridRightCol>
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
