import { Box } from 'leather-styles/jsx';

import { shimmerStyles } from '@app/ui/shared/shimmer-styles';

interface SkeletonLoaderProps {
  isLoading: boolean;
  children?: React.ReactNode;
  width?: string;
  height?: string;
}
export function SkeletonLoader({
  children,
  width = '30px',
  height = '30px',
  isLoading,
}: SkeletonLoaderProps) {
  if (isLoading) {
    return (
      <Box
        width={width}
        height={height}
        bgColor="ink.text-non-interactive"
        data-state="loading"
        borderRadius="sm"
        className={shimmerStyles}
      />
    );
  }

  return <>{children}</>;
}
