import { OrdinalMinimalIcon } from '@app/components/icons/ordinal-minimal-icon';

import { CollectibleImageLayout } from './collectible-image.layout';
import { CollectibleItemLayout, CollectibleItemLayoutProps } from './collectible-item.layout';

interface ImageCollectibleProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  src: string;
}
export function CollectibleImage(props: ImageCollectibleProps) {
  const { src, ...rest } = props;
  return (
    <CollectibleItemLayout collectibleTypeIcon={<OrdinalMinimalIcon />} {...rest}>
      <CollectibleImageLayout src={src} />
    </CollectibleItemLayout>
  );
}
