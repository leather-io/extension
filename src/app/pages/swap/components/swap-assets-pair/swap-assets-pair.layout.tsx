import { Box, Stack } from 'leather-styles/jsx';

import { ArrowDownIcon } from '@leather.io/ui';

interface SwapAssetsPairLayoutProps {
  swapAssetBase: React.JSX.Element;
  swapAssetQuote: React.JSX.Element;
}
export function SwapAssetsPairLayout({ swapAssetBase, swapAssetQuote }: SwapAssetsPairLayoutProps) {
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
      {swapAssetBase}
      <Box height="24px" px="space.04" py="space.01" width="48px">
        <ArrowDownIcon variant="small" />
      </Box>
      {swapAssetQuote}
    </Stack>
  );
}
