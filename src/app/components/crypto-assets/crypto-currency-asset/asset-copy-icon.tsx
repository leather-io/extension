import { FiCheck, FiCopy } from 'react-icons/fi';

import { Box, Flex, color } from '@stacks/ui';

interface AssetItemCopyIconProps {
  hasCopied: boolean;
}

export function AssetItemCopyIcon({ hasCopied }: AssetItemCopyIconProps) {
  return (
    <Flex alignItems="center" justifyContent="center" size="36px">
      <Box
        size="16px"
        color={color('text-caption')}
        data-testid="account-copy-address"
        as={hasCopied ? FiCheck : FiCopy}
        mt="2px"
      />
    </Flex>
  );
}
