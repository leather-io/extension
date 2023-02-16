import { FiCopy } from 'react-icons/fi';

import { Box, Flex, Tooltip, useClipboard } from '@stacks/ui';
import { color, truncateMiddle } from '@stacks/ui-utils';
import { UserAreaSelectors } from '@tests-legacy/integration/user-area.selectors';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Caption } from '@app/components/typography';

interface AccountAddressProps {
  address: string;
  label: string;
}
export function AccountAddress({ address, label }: AccountAddressProps) {
  const { onCopy, hasCopied } = useClipboard(address);
  const analytics = useAnalytics();

  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    onCopy();
  };

  return (
    <>
      <Tooltip hideOnClick={false} label={hasCopied ? 'Copied!' : label} placement="right">
        <Flex onClick={copyToClipboard} cursor="pointer">
          <Caption mr="8px">{truncateMiddle(address, 4)}</Caption>
          <Box
            _hover={{ cursor: 'pointer' }}
            size="12px"
            color={color('text-caption')}
            data-testid={UserAreaSelectors.AccountCopyAddress}
            as={FiCopy}
          />
        </Flex>
      </Tooltip>
    </>
  );
}
