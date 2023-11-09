import { Box, Flex } from 'leather-styles/jsx';

import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';

interface AssetItemCopyIconProps {
  hasCopied: boolean;
}

export function AssetItemCopyIcon({ hasCopied }: AssetItemCopyIconProps) {
  // #4476 TODO - test and refactor this, so many elements for just an icon!
  return (
    <Flex alignItems="center" justifyContent="center" width="36px" height="36px">
      <Box color="accent.text-subdued" data-testid="account-copy-address" mt="2px">
        {hasCopied ? <CheckmarkIcon size="36px" /> : <CopyIcon size="36px" />}
      </Box>
    </Flex>
  );
}
