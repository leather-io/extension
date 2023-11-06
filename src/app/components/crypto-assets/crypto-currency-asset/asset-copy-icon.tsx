import { FiCheck, FiCopy } from 'react-icons/fi';

import { Box, Flex } from 'leather-styles/jsx';

interface AssetItemCopyIconProps {
  hasCopied: boolean;
}

export function AssetItemCopyIcon({ hasCopied }: AssetItemCopyIconProps) {
  // TODO - test this
  // FIXME - refactor this, so many elements for just an icon!
  return (
    <Flex alignItems="center" justifyContent="center" width="36px" height="36px">
      <Box
        width="36px"
        height="36px"
        color={color('text-caption')}
        data-testid="account-copy-address"
        as={hasCopied ? FiCheck : FiCopy}
        mt="2px"
      />
    </Flex>
  );
}
