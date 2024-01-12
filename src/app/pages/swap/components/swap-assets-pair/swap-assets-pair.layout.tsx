import { Box, Stack } from 'leather-styles/jsx';

import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';

interface SwapAssetsPairLayoutProps {
  swapAssetFrom: React.JSX.Element;
  swapAssetTo: React.JSX.Element;
}
export function SwapAssetsPairLayout({ swapAssetFrom, swapAssetTo }: SwapAssetsPairLayoutProps) {
  return (
    <Stack
      border="default"
      borderRadius="sm"
      gap="space.01"
      mb="space.05"
      mt="space.04"
      p="space.04"
      width="100%"
    >
      {swapAssetFrom}
      <Box height="24px" px="space.04" py="space.01" width="48px">
        <ArrowDownIcon />
      </Box>
      {swapAssetTo}
    </Stack>
  );
}
