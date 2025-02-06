import { ReactNode, useState } from 'react';

import { Iframe } from '@app/ui/components/iframe';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from './collectible-item.layout';
import { ImageUnavailable } from './image-unavailable';

interface CollectibleIframeProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  icon: ReactNode;
  src: string;
}
export function CollectibleIframe({ icon, src, ...props }: CollectibleIframeProps) {
  const [isError, setIsError] = useState(false);

  if (isError)
    return (
      <CollectibleItemLayout collectibleTypeIcon={icon} {...props}>
        <ImageUnavailable />
      </CollectibleItemLayout>
    );

  return (
    <CollectibleItemLayout collectibleTypeIcon={icon} {...props}>
      <Iframe
        aspectRatio="1 / 1"
        height="100%"
        objectFit="cover"
        onError={() => setIsError(true)}
        src={src}
        width="100%"
        zIndex={99}
        tabIndex={-1}
      />
    </CollectibleItemLayout>
  );
}
