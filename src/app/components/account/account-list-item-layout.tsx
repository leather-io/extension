import { FiCopy } from 'react-icons/fi';

import { Box, Flex, Spinner, Stack, StackProps, color, useMediaQuery } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { UserAreaSelectors } from '@tests-legacy/integration/user-area.selectors';
import { SettingsMenuSelectors } from '@tests/selectors/settings.selectors';

import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';
import { useConfigBitcoinEnabled } from '@app/query/common/hiro-config/hiro-config.query';

import { CaptionDotSeparator } from '../caption-dot-separator';
import { AccountActiveCheckmark } from './account-active-checkmark';

interface AccountListItemLayoutProps extends StackProps {
  isLoading: boolean;
  isActive: boolean;
  index: number;
  stxAddress: string;
  btcAddress: string;
  accountName: React.ReactNode;
  avatar: React.ReactNode;
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
      data-testid={SettingsMenuSelectors.SwitchAccountItemIndex.replace('[index]', `${index}`)}
      cursor="pointer"
      position="relative"
      onClick={onSelectAccount}
      {...rest}
    >
      <Stack isInline alignItems="center" spacing="base">
        {avatar}
        <Stack spacing="base-tight">
          <Flex>
            {accountName}
            {isActive && isNarrowViewport && <AccountActiveCheckmark index={index} ml="tight" />}
          </Flex>
          <Stack alignItems="center" spacing="6px" isInline whiteSpace="nowrap">
            <CaptionDotSeparator>
              <Flex>
                <Caption>{truncateMiddle(stxAddress, isNarrowViewport ? 3 : 4)}</Caption>
                {onCopyToClipboard && (
                  <Tooltip
                    placement="right"
                    label={hasCopied ? 'Copied!' : 'Copy Stacks address'}
                    hideOnClick={false}
                  >
                    <Box
                      as="button"
                      onClick={e => onCopyToClipboard?.(e)}
                      color={color('text-caption')}
                      data-testid={UserAreaSelectors.AccountCopyAddress}
                      mt="2px"
                      ml="4px"
                    >
                      <FiCopy size="12px" />
                    </Box>
                  </Tooltip>
                )}
              </Flex>
              {isBitcoinEnabled && (
                <Flex>
                  <Caption>{truncateMiddle(btcAddress, 5)}</Caption>
                  {onClickBtcCopyIcon && (
                    <Box
                      as="button"
                      onClick={e => onClickBtcCopyIcon?.(e)}
                      color={color('text-caption')}
                      data-testid={UserAreaSelectors.AccountCopyAddress}
                      mt="2px"
                      ml="4px"
                    >
                      <FiCopy size="12px" />
                    </Box>
                  )}
                </Flex>
              )}
              {balanceLabel}
            </CaptionDotSeparator>
          </Stack>
        </Stack>
      </Stack>
      {isLoading && (
        <Spinner
          position="absolute"
          right={0}
          top="calc(50% - 8px)"
          color={color('text-caption')}
          size="18px"
        />
      )}
      {isActive && !isNarrowViewport && (
        <AccountActiveCheckmark index={index} position="absolute" right={0} top="calc(50% - 8px)" />
      )}
      {children}
    </Flex>
  );
}
