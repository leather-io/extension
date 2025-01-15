import { ReactNode } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';

import {
  ChevronDownIcon,
  Flag,
  InfoCircleIcon,
  Link,
  SkeletonLoader,
  shimmerStyles,
} from '@leather.io/ui';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { useScaleText } from '@app/common/hooks/use-scale-text';
import { AccountNameLayout } from '@app/components/account/account-name';
import { PrivateTextLayout } from '@app/components/privacy/private-text.layout';

import { BasicTooltip } from '../tooltip/basic-tooltip';

const availableBalanceTooltipLabel =
  'Total balance minus locked amounts, outbound transfers, protected collectibles and uneconomical UTXOs';

interface AccountCardProps {
  name: string;
  availableBalance: string;
  totalBalance: string;
  children: ReactNode;
  isFetchingBnsName: boolean;
  isLoadingBalance: boolean;
  isLoadingAdditionalData?: boolean;
  isBalancePrivate?: boolean;
  toggleSwitchAccount(): void;
  onShowBalance?(): void;
}

export function AccountCard({
  name,
  availableBalance,
  totalBalance,
  toggleSwitchAccount,
  onShowBalance,
  children,
  isFetchingBnsName,
  isLoadingBalance,
  isLoadingAdditionalData,
  isBalancePrivate,
}: AccountCardProps) {
  const scaleTextRef = useScaleText();
  const isAtLeastMd = useViewportMinWidth('md');
  const tooltipSide = isAtLeastMd ? 'right' : 'bottom';

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
          <SkeletonLoader width="200px" height="46px" isLoading={isLoadingBalance}>
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
                {totalBalance}
              </PrivateTextLayout>
            </styled.h1>
            <styled.h2 textStyle="label.02" color="ink.text-subdued" mt="space.01">
              Available balance:
              <styled.span ml="space.01">
                <BasicTooltip side={tooltipSide} label={availableBalanceTooltipLabel}>
                  <Flag
                    reverse
                    spacing="space.01"
                    img={
                      <InfoCircleIcon color="ink.text-subdued" display="inline" variant="small" />
                    }
                  >
                    {availableBalance}
                  </Flag>
                </BasicTooltip>
              </styled.span>
            </styled.h2>
          </SkeletonLoader>
        </Box>
        {children}
      </Flex>
    </Flex>
  );
}
