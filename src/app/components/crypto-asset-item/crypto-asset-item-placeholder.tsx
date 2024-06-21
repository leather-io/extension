import { Box, Circle } from 'leather-styles/jsx';

import { ItemLayout, SkeletonLoader } from '@leather.io/ui';

export function CryptoAssetItemPlaceholder() {
  return (
    <Box my="space.02">
      <ItemLayout
        flagImg={<Circle bgColor="ink.text-non-interactive" size="36px" />}
        titleLeft={<SkeletonLoader isLoading height="20px" width="126px" />}
        captionLeft={<SkeletonLoader isLoading height="20px" width="78px" />}
        titleRight={<SkeletonLoader isLoading width="126px" />}
        captionRight={<SkeletonLoader isLoading width="78px" />}
      />
    </Box>
  );
}
