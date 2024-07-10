import { useNavigate, useOutletContext } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { styled } from 'leather-styles/jsx';

import { ArrowLeftIcon, CloseIcon, HamburgerIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { SwitchAccountOutletContext } from '@shared/switch-account';

import { Header } from '@app/components/layout/headers/header';
import { HeaderActionButton } from '@app/components/layout/headers/header-action-button';
import { HeaderGrid, HeaderGridRightCol } from '@app/components/layout/headers/header-grid';
import { LogoBox } from '@app/components/layout/headers/logo-box';
import { Settings } from '@app/features/settings/settings';

interface PageHeaderProps {
  title?: string;
  isSummaryPage?: boolean;
  isSessionLocked?: boolean;
  isSettingsVisibleOnSm?: boolean;
  onBackLocation?: RouteUrls;
  onClose?(): void;
}

export function PageHeader({
  title,
  isSummaryPage,
  isSessionLocked,
  isSettingsVisibleOnSm,
  onBackLocation,
}: PageHeaderProps) {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } =
    useOutletContext<SwitchAccountOutletContext>();
  const navigate = useNavigate();

  // pages with nested dialogs specify onBackLocation to prevent navigate(-1) re-opening the dialog
  const onGoBack = onBackLocation ? () => navigate(onBackLocation) : () => navigate(-1);
  const canGoBack = !isSummaryPage && !isSessionLocked;

  return (
    <>
      <Header>
        <HeaderGrid
          leftCol={
            <>
              {canGoBack && (
                <HeaderActionButton
                  icon={<ArrowLeftIcon />}
                  onAction={onGoBack}
                  dataTestId={SharedComponentsSelectors.HeaderBackBtn}
                />
              )}
              <LogoBox isSessionLocked={isSessionLocked} />
            </>
          }
          centerCol={title && <styled.span textStyle="heading.05">{title}</styled.span>}
          rightCol={
            <HeaderGridRightCol>
              {isSummaryPage ? (
                <HeaderActionButton
                  icon={<CloseIcon />}
                  dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
                  onAction={() => navigate(RouteUrls.Home)}
                />
              ) : (
                <styled.div hideBelow={isSettingsVisibleOnSm ? undefined : 'sm'}>
                  <Settings
                    triggerButton={
                      <HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />
                    }
                    toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                  />
                </styled.div>
              )}
            </HeaderGridRightCol>
          }
        />
      </Header>
    </>
  );
}
