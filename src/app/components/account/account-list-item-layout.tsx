import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, HStack, Stack, StackProps, styled } from 'leather-styles/jsx';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { BulletSeparator } from '@app/ui/components/bullet-separator/bullet-separator';
import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { Spinner } from '@app/ui/components/spinner';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

import { Flag } from '../layout/flag';
import { StacksAccountLoader } from '../loaders/stacks-account-loader';
import { BitcoinNativeSegwitAccountLoader } from './bitcoin-account-loader';

interface AccountListItemLayoutProps extends StackProps {
  isLoading: boolean;
  isActive: boolean;
  index: number;
  accountName: React.ReactNode;
  avatar: React.JSX.Element;
  balanceLabel: React.ReactNode;
  onSelectAccount(): void;
}
export function AccountListItemLayout(props: AccountListItemLayoutProps) {
  const {
    index,
    isLoading,
    isActive,
    accountName,
    avatar,
    balanceLabel,
    onSelectAccount,
    children = null,
    ...rest
  } = props;

  const isBreakpointSm = useViewportMinWidth('sm');

  return (
    <Flex
      width="100%"
      key={`account-${index}`}
      data-testid={SettingsSelectors.SwitchAccountItemIndex.replace('[index]', `${index}`)}
      cursor="pointer"
      position="relative"
      onClick={onSelectAccount}
      {...rest}
    >
      <Flag align="middle" img={avatar} spacing="space.04" width="100%" mx="space.04">
        <Stack gap="space.01">
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" gap="space.02">
              {accountName}
              {isActive && <CheckmarkIcon />}
            </HStack>
            {isLoading ? (
              <Spinner
                color="accent.text-subdued"
                position="absolute"
                right={0}
                size="18px"
                top="calc(50% - 8px)"
              />
            ) : (
              balanceLabel
            )}
          </HStack>
          <HStack alignItems="center" gap="space.02" whiteSpace="nowrap">
            <BulletSeparator>
              <StacksAccountLoader index={index}>
                {account => (
                  <styled.span textStyle="caption.02">
                    {truncateMiddle(account.address, isBreakpointSm ? 4 : 3)}
                  </styled.span>
                )}
              </StacksAccountLoader>

              <BitcoinNativeSegwitAccountLoader index={index}>
                {signer => (
                  <styled.span textStyle="caption.02">
                    {truncateMiddle(signer.address, 5)}
                  </styled.span>
                )}
              </BitcoinNativeSegwitAccountLoader>
            </BulletSeparator>
          </HStack>
        </Stack>
      </Flag>
      {children}
    </Flex>
  );
}
