import { CollectibleImageLayout } from './collectible-image.layout';
import { CollectibleLayout, CollectibleLayoutProps } from './collectible.layout';

interface ImageCollectibleProps extends Omit<CollectibleLayoutProps, 'children'> {
  src: string;
}
export function CollectibleImage(props: ImageCollectibleProps) {
  const { src, ...rest } = props;
  return (
    <CollectibleLayout {...rest}>
      <CollectibleImageLayout src={src} />
    </CollectibleLayout>
  );
}
