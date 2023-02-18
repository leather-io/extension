import { FiCopy } from 'react-icons/fi';

import {
  Box,
  Flex,
  Spinner,
  Stack,
  StackProps,
  color,
  useClipboard,
  useMediaQuery,
} from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { UserAreaSelectors } from '@tests-legacy/integration/user-area.selectors';
import { SettingsMenuSelectors } from '@tests/selectors/settings.selectors';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';
import { useBitcoinFeature } from '@app/store/feature-flags/feature-flags.slice';

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
    children = null,
    ...rest
  } = props;

  const [isNarrowViewport] = useMediaQuery('(max-width: 400px)');
  const analytics = useAnalytics();
  const { onCopy, hasCopied } = useClipboard(stxAddress || '');
  const { onCopy: onCopyBtc, hasCopied: hasCopiedBtc } = useClipboard(btcAddress || '');
  const isBitcoinEnabled = useBitcoinFeature();

  const copyToClipboard = (e: React.MouseEvent, isStacksAddress = true) => {
    e.stopPropagation();
    void analytics.track('copy_address_to_clipboard');
    if (isStacksAddress) {
      onCopy();
      return;
    }
    onCopyBtc();
  };

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
                <Caption mr="4px">{truncateMiddle(stxAddress, isNarrowViewport ? 3 : 4)}</Caption>
                <Tooltip
                  placement="right"
                  label={hasCopied ? 'Copied!' : 'Copy Stacks address'}
                  hideOnClick={false}
                >
                  <Stack>
                    <Box
                      _hover={{ cursor: 'pointer' }}
                      onClick={copyToClipboard}
                      size="12px"
                      color={color('text-caption')}
                      data-testid={UserAreaSelectors.AccountCopyAddress}
                      as={FiCopy}
                      mt="1px"
                    />
                  </Stack>
                </Tooltip>
              </Flex>

              {isBitcoinEnabled && (
                <Flex>
                  <Caption mr="4px">{truncateMiddle(btcAddress, 5)}</Caption>
                  <Tooltip
                    placement="right"
                    label={hasCopiedBtc ? 'Copied!' : 'Copy Bitcoin address'}
                    hideOnClick={false}
                  >
                    <Stack>
                      <Box
                        _hover={{ cursor: 'pointer' }}
                        onClick={event => copyToClipboard(event, false)}
                        size="12px"
                        color={color('text-caption')}
                        data-testid={UserAreaSelectors.AccountCopyAddress}
                        as={FiCopy}
                        mt="1px"
                      />
                    </Stack>
                  </Tooltip>
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
