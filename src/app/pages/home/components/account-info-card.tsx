import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Divider, Flex, styled } from 'leather-styles/jsx';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { LeatherButton } from '@app/components/button/button';
import { ChevronDownIcon } from '@app/components/icons/chevron-down-icon';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { AccountActions } from './account-actions';

export function AccountInfoCard() {
  const name = useCurrentAccountDisplayName();

  const account = useCurrentStacksAccount();
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const totalBalance = useTotalBalance({ btcAddress, stxAddress: account?.address || '' });

  const { setIsShowingSwitchAccountsState } = useDrawers();

  return (
    <Flex
      direction="column"
      bgColor={{ base: 'brown.2', sm: 'unset' }}
      rounded="10px"
      px={{ base: 'space.05', sm: '0' }}
      pt={{ base: 'space.05', sm: 'space.07' }}
      pb={{ base: 'space.02', sm: 'space.07' }}
    >
      <LeatherButton
        onClick={() => setIsShowingSwitchAccountsState(true)}
        variant="link"
        _before={{ bg: 'transparent' }}
      >
        <Flex>
          <styled.p
            data-testid={SettingsSelectors.CurrentAccountDisplayName}
            textStyle="label.01"
            mr={['space.00', 'space.02']}
          >
            {name}
          </styled.p>
          <Box mt="space.01" ml="space.02">
            <ChevronDownIcon />
          </Box>
        </Flex>
      </LeatherButton>
      <Flex flexDir={['column', 'row']} justify="space-between" alignItems={['', 'center']}>
        <styled.h1 textStyle="heading.02" mb="space.05" mt="space.04">
          {totalBalance?.totalUsdBalance}
        </styled.h1>
        <Divider
          position="relative"
          color="accent.border-default"
          right="space.05"
          width="calc(100% + 48px)"
          mb="space.02"
          hideFrom="sm"
        />

        <AccountActions />
      </Flex>
    </Flex>
  );
}
