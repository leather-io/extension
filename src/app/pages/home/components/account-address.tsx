import { FiCopy } from 'react-icons/fi';

import { Box, Flex, Text, useClipboard } from '@stacks/ui';
import { color } from '@stacks/ui-utils';
import { UserAreaSelectors } from '@tests-legacy/integration/user-area.selectors';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Tooltip } from '@app/components/tooltip';

interface AccountAddressProps {
  address: string;
  addressLabel: string;
  label: string;
}
export function AccountAddress({ address, addressLabel, label }: AccountAddressProps) {
  const { onCopy, hasCopied } = useClipboard(address);
  const analytics = useAnalytics();

  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    onCopy();
  };

  return (
    <>
      <Tooltip hideOnClick={false} label={hasCopied ? 'Copied!' : label} placement="right">
        <Flex onClick={copyToClipboard} as="button">
          <Text color={color('text-caption')} fontSize={['12px', '14px']} mr="4px">
            {addressLabel}
          </Text>
          <Box
            size="12px"
            color={color('text-caption')}
            data-testid={UserAreaSelectors.AccountCopyAddress}
            as={FiCopy}
            mt="2px"
          />
        </Flex>
      </Tooltip>
    </>
  );
}
