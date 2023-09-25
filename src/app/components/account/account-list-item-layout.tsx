import { Flex, Spinner, Stack, StackProps, color, useMediaQuery } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { HStack, styled } from 'leather-styles/jsx';

import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';

import { CaptionDotSeparator } from '../caption-dot-separator';
import { CheckmarkIcon } from '../icons/checkmark-icon';
import { Flag } from '../layout/flag';

interface AccountListItemLayoutProps extends StackProps {
  isLoading: boolean;
  isActive: boolean;
  index: number;
  stxAddress: string;
  btcAddress: string;
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
    stxAddress,
    btcAddress,
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

  const [isNarrowViewport] = useMediaQuery('(max-width: 400px)');
  const isBitcoinEnabled = useConfigBitcoinEnabled();

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
      <Flag align="middle" img={avatar} spacing="base" width="100%">
        <Stack spacing="extra-tight">
          <HStack alignItems="center" justifyContent="space-between">
            <Stack alignItems="center" isInline space="tight">
              {accountName}
              {isActive && <CheckmarkIcon />}
            </Stack>
            {isLoading ? (
              <Spinner
                position="absolute"
                right={0}
                top="calc(50% - 8px)"
                color={color('text-caption')}
                size="18px"
              />
            ) : (
              balanceLabel
            )}
          </HStack>
          <Stack alignItems="center" spacing="6px" isInline whiteSpace="nowrap">
            <CaptionDotSeparator>
              <styled.span textStyle="caption.02">
                {truncateMiddle(stxAddress, isNarrowViewport ? 3 : 4)}
              </styled.span>
              {isBitcoinEnabled && (
                <styled.span textStyle="caption.02">{truncateMiddle(btcAddress, 5)}</styled.span>
              )}
            </CaptionDotSeparator>
          </Stack>
        </Stack>
      </Flag>
      {children}
    </Flex>
  );
}
