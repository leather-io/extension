import { Box, Stack } from 'leather-styles/jsx';

import { ArrowDownIcon } from '@app/components/icons/arrow-down-icon';

interface SwapAssetsPairLayoutProps {
  swapAssetFrom: React.JSX.Element;
  swapAssetTo: React.JSX.Element;
}
export function SwapAssetsPairLayout({ swapAssetFrom, swapAssetTo }: SwapAssetsPairLayoutProps) {
  return (
    <Stack
      border="1px solid"
      borderColor="accent.border-default !important"
      borderRadius="10px"
      gap="space.01"
      mb="space.05"
      mt="space.04"
      p="space.05"
      width="100%"
    >
      {swapAssetFrom}
      <Box p="space.02">
        <ArrowDownIcon />
      </Box>
      {swapAssetTo}
    </Stack>
  );
}
