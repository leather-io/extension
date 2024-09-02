import { ReactNode } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { ChevronDownIcon, Link, SkeletonLoader, shimmerStyles } from '@leather.io/ui';

import { useScaleText } from '@app/common/hooks/use-scale-text';
import { AccountNameLayout } from '@app/components/account/account-name';
import { PrivateTextLayout } from '@app/components/privacy/private-text.layout';

interface AccountCardProps {
  name: string;
  balance: string;
  children: ReactNode;
  toggleSwitchAccount(): void;
  isFetchingBnsName: boolean;
  isLoadingBalance: boolean;
  isLoadingAdditionalData?: boolean;
  isBalancePrivate?: boolean;
  onShowBalance?(): void;
}

export function AccountCard({
  name,
  balance,
  toggleSwitchAccount,
  onShowBalance,
  children,
  isFetchingBnsName,
  isLoadingBalance,
  isLoadingAdditionalData,
  isBalancePrivate,
}: AccountCardProps) {
  const scaleTextRef = useScaleText();

  return (
    <Flex
      direction="column"
      border={{ base: 'active', sm: 'unset' }}
      rounded="md"
      px={{ base: 'space.05', sm: '0' }}
      pt={{ base: 'space.05', md: '0' }}
    >
      <Flex flexDir="row" justify="space-between" align="center">
        <Link
          _before={{ bg: 'transparent' }}
          _hover={{ color: 'ink.action-primary-hover' }}
          data-testid={SettingsSelectors.SwitchAccountTrigger}
          onClick={toggleSwitchAccount}
          variant="text"
          maxWidth="fit-content"
        >
          <Flex>
            <AccountNameLayout
              isLoading={isFetchingBnsName}
              data-testid={SettingsSelectors.CurrentAccountDisplayName}
              textStyle="label.01"
            >
              {name}
            </AccountNameLayout>

            <Box mt="space.01" ml="space.02">
              <ChevronDownIcon variant="small" />
            </Box>
          </Flex>
        </Link>
      </Flex>
      <Flex flexDir={{ base: 'column', md: 'row' }} justify="space-between">
        <Box mb="space.05" mt="space.04">
          <SkeletonLoader width="200px" height="38px" isLoading={isLoadingBalance}>
            <styled.h1
              textStyle="heading.02"
              data-state={isLoadingAdditionalData ? 'loading' : undefined}
              className={shimmerStyles}
              data-testid={SharedComponentsSelectors.AccountCardBalanceText}
              style={{
                whiteSpace: 'nowrap',
                display: 'inline-block',
                transformOrigin: 'left center',
                maxWidth: '100%',
              }}
              ref={scaleTextRef}
            >
              <PrivateTextLayout
                isPrivate={isBalancePrivate}
                onShowValue={onShowBalance}
                display="inline-block"
                overflow="hidden"
              >
                {balance}
              </PrivateTextLayout>
            </styled.h1>
          </SkeletonLoader>
        </Box>
        {children}
      </Flex>
    </Flex>
  );
}
