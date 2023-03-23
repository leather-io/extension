import { useState } from 'react';

import { Spinner } from '@stacks/ui';

import { figmaTheme } from '@app/common/utils/figma-theme';

import { ImageUnavailable } from './components/image-unavailable';

interface ImageCollectibleProps {
  src: string;
}
export function CollectibleImageLayout({ src }: ImageCollectibleProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (isError) return <ImageUnavailable />;

  return (
    <>
      {isLoading && <Spinner color={figmaTheme.icon} size="16px" />}
      <img
        onError={() => setIsError(true)}
        onLoad={() => setIsLoading(false)}
        src={src}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          display: isLoading ? 'none' : 'inherit',
        }}
      />
    </>
  );
}
