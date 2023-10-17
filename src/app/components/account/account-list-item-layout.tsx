import { Spinner } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, HStack, Stack, StackProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';

import { CaptionDotSeparator } from '../caption-dot-separator';
import { CheckmarkIcon } from '../icons/checkmark-icon';
import { Flag } from '../layout/flag';
import { StacksAccountLoader } from '../stacks-account-loader';
import { BitcoinNativeSegwitAccountLoader } from './bitcoin-account-loader';

interface AccountListItemLayoutProps extends StackProps {
  isLoading: boolean;
  isActive: boolean;
  index: number;
  accountName: React.ReactNode;
  avatar: React.JSX.Element;
  balanceLabel: React.ReactNode;
  hasCopied?: boolean;
  onCopyToClipboard?(e: React.MouseEvent): void;
  onClickBtcCopyIcon?(e: React.MouseEvent): void;
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
    hasCopied,
    onCopyToClipboard,
    onClickBtcCopyIcon,
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
      <Flag align="middle" img={avatar} spacing="space.04" width="100%" mr="space.04">
        <Stack gap="space.01">
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" gap="space.02">
              {accountName}
              {isActive && <CheckmarkIcon />}
            </HStack>
            {isLoading ? (
              <Spinner
                position="absolute"
                right={0}
                top="calc(50% - 8px)"
                color={token('colors.accent.text-subdued')}
                size="18px"
              />
            ) : (
              balanceLabel
            )}
          </HStack>
          <HStack alignItems="center" gap="space.02" whiteSpace="nowrap">
            <CaptionDotSeparator>
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
            </CaptionDotSeparator>
          </HStack>
        </Stack>
      </Flag>
      {children}
    </Flex>
  );
}
