import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Divider, Flex, styled } from 'leather-styles/jsx';

import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useTotalBalance } from '@app/common/hooks/balance/use-total-balance';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ChevronDownIcon } from '@app/ui/components/icons/chevron-down-icon';
import { Link } from '@app/ui/components/link/link';

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
      bgColor={{ base: 'ink.2', sm: 'unset' }}
      rounded="sm"
      px={{ base: 'space.05', sm: '0' }}
      pt={{ base: 'space.05', sm: 'space.06' }}
      pb={{ base: 'space.02', sm: 'space.06' }}
    >
      <Link
        _before={{ bg: 'transparent' }}
        _hover={{ color: 'accent.action-primary-hover' }}
        onClick={() => setIsShowingSwitchAccountsState(true)}
      >
        <Flex>
          <styled.p data-testid={SettingsSelectors.CurrentAccountDisplayName} textStyle="label.01">
            {name}
          </styled.p>
          <Box mt="space.01" ml="space.02">
            <ChevronDownIcon />
          </Box>
        </Flex>
      </Link>
      <Flex
        flexDir={['column', 'column', 'row']}
        justify="space-between"
        alignItems={['', 'center']}
      >
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
