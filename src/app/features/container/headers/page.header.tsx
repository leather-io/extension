import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { styled } from 'leather-styles/jsx';

import { ArrowLeftIcon, BarsTwoIcon, CloseIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { Header } from '@app/components/layout/headers/header';
import { HeaderActionButton } from '@app/components/layout/headers/header-action-button';
import { HeaderGrid, HeaderGridRightCol } from '@app/components/layout/headers/header-grid';
import { LogoBox } from '@app/components/layout/headers/logo-box';
import { Settings } from '@app/features/settings/settings';

interface PageHeaderProps {
  title?: ReactNode;
  isSummaryPage?: boolean;
  isSettingsVisibleOnSm?: boolean;
  onBackLocation?: RouteUrls;
  onClose?(): void;
}

export function PageHeader({
  title,
  isSummaryPage = false,
  isSettingsVisibleOnSm = true,
  onBackLocation,
}: PageHeaderProps) {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } = useSwitchAccountSheet();
  const navigate = useNavigate();

  // pages with nested dialogs specify onBackLocation to prevent navigate(-1) re-opening the dialog
  const onGoBack = onBackLocation ? () => navigate(onBackLocation) : () => navigate(-1);
  const canGoBack = !isSummaryPage;
  return (
    <Header px={{ base: 'space.04', sm: 'space.00' }}>
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
            <LogoBox onClick={() => navigate(RouteUrls.Home)} />
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
                  triggerButton={<BarsTwoIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
                  toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                />
              </styled.div>
            )}
          </HeaderGridRightCol>
        }
      />
    </Header>
  );
}
