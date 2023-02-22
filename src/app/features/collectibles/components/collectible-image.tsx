import { CollectibleLayout, CollectibleLayoutProps } from './collectible.layout';

interface ImageCollectibleProps extends Omit<CollectibleLayoutProps, 'children'> {
  src: string;
}
export function CollectibleImage(props: ImageCollectibleProps) {
  const { src, ...rest } = props;
  return (
    <CollectibleLayout {...rest}>
      <img
        src={src}
        style={{ width: '100%', height: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
      />
    </CollectibleLayout>
  );
}
