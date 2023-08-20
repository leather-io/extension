import { FiArrowDown } from 'react-icons/fi';

import { Box, Stack, color } from '@stacks/ui';

interface SwapAssetsPairLayoutProps {
  swapAssetFrom: React.JSX.Element;
  swapAssetTo: React.JSX.Element;
}
export function SwapAssetsPairLayout({ swapAssetFrom, swapAssetTo }: SwapAssetsPairLayoutProps) {
  return (
    <Stack
      border="4px solid"
      borderColor={color('border')}
      borderRadius="16px"
      mb="loose"
      mt="base"
      p="loose"
      spacing="extra-tight"
      width="100%"
    >
      {swapAssetFrom}
      <Box p="tight" size="32px">
        <FiArrowDown size="20px" />
      </Box>
      {swapAssetTo}
    </Stack>
  );
}
