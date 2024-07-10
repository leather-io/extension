import { ReactNode, useState } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { HamburgerIcon } from '@leather.io/ui';

import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';

import { Settings } from '../../../settings/settings';

interface HomeHeaderProps {
  networkBadge?: ReactNode;
  logo?: ReactNode;
}

export function HomeHeader({ networkBadge, logo }: HomeHeaderProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  return (
    <>
      {isShowingSwitchAccount && (
        <SwitchAccountDialog
          isShowing={isShowingSwitchAccount}
          onClose={() => setIsShowingSwitchAccount(false)}
        />
      )}
      <styled.header
        justifyContent="center"
        margin={{ base: 0, md: 'auto' }}
        p="space.04"
        bg="transparent"
        maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
        width="100%"
      >
        <Grid alignItems="center" gridTemplateColumns="auto" gridAutoFlow="column" width="100%">
          <GridItem justifySelf="start">
            <Flex py={{ base: 0, md: 'space.01' }}>{logo}</Flex>
          </GridItem>

          <GridItem>
            <HStack alignItems="center" justifyContent="flex-end">
              {networkBadge}
              <Settings
                triggerButton={<HamburgerIcon data-testid={SettingsSelectors.SettingsMenuBtn} />}
                toggleSwitchAccount={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
              />
            </HStack>
          </GridItem>
        </Grid>
      </styled.header>
    </>
  );
}
