import { Box } from 'leather-styles/jsx';

import { Flag, Logo } from '@leather.io/ui';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { Header } from '@app/components/layout/headers/header';
import { HeaderGrid, HeaderGridRightCol } from '@app/components/layout/headers/header-grid';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { TotalBalance } from '@app/features/total-balance/total-balance';

interface PopupHeaderProps {
  showSwitchAccount?: boolean;
  balance?: 'all' | 'stx';
}

export function PopupHeader({ showSwitchAccount, balance }: PopupHeaderProps) {
  const { isShowingSwitchAccount, setIsShowingSwitchAccount } = useSwitchAccountSheet();

  return (
    <Header>
      <HeaderGrid
        gridTemplateColumns="auto auto"
        leftCol={
          <>
            {showSwitchAccount ? (
              <Flag
                align="middle"
                img={<CurrentAccountAvatar />}
                onClick={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
                cursor="pointer"
              >
                <CurrentAccountName />
              </Flag>
            ) : (
              <Box height="headerPopupHeight" margin="auto" px="space.02">
                <Logo />
              </Box>
            )}
          </>
        }
        rightCol={
          <HeaderGridRightCol>
            {balance && <TotalBalance displayAddresssBalanceOf={balance} />}
          </HeaderGridRightCol>
        }
      />
    </Header>
  );
}
