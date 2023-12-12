import { ReactNode, useState } from 'react';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from '../collectible-item.layout';
import { ImageUnavailable } from '../image-unavailable';

interface CollectibleImageProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  alt?: string;
  icon: ReactNode;
  src: string;
}
export function CollectibleImage(props: CollectibleImageProps) {
  const { alt, icon, src, ...rest } = props;
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [width, setWidth] = useState(0);

  if (isError)
    return (
      <CollectibleItemLayout collectibleTypeIcon={icon} {...rest}>
        <ImageUnavailable />
      </CollectibleItemLayout>
    );

  return (
    <CollectibleItemLayout collectibleTypeIcon={icon} {...rest}>
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
