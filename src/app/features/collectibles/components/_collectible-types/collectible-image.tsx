import { useState } from 'react';

import { Spinner } from '@stacks/ui';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { OrdinalMinimalIcon } from '@app/components/icons/ordinal-minimal-icon';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from '../collectible-item.layout';
import { ImageUnavailable } from '../image-unavailable';

interface CollectibleImageProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  alt?: string;
  src: string;
}
export function CollectibleImage(props: CollectibleImageProps) {
  const { alt, src, ...rest } = props;
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [width, setWidth] = useState(0);

  if (isError)
    return (
      <CollectibleItemLayout collectibleTypeIcon={<OrdinalMinimalIcon />} {...rest}>
        <ImageUnavailable />
      </CollectibleItemLayout>
    );

  return (
    <CollectibleItemLayout collectibleTypeIcon={<OrdinalMinimalIcon />} {...rest}>
      {isLoading && <Spinner color={figmaTheme.icon} size="16px" />}
      <img
        alt={alt}
        onError={() => setIsError(true)}
        onLoad={event => {
          const target = event.target as HTMLImageElement;
          setWidth(target.naturalWidth);
          setIsLoading(false);
        }}
        src={src}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          display: isLoading ? 'none' : 'inherit',
          imageRendering: width <= 40 ? 'pixelated' : 'auto',
        }}
      />
    </CollectibleItemLayout>
  );
}
