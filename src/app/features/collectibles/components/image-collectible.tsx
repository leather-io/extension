import { BaseCollectible, BaseCollectibleProps } from './base-collectible';

interface ImageCollectibleProps extends Omit<BaseCollectibleProps, 'children'> {
  src: string;
}
export function ImageCollectible(props: ImageCollectibleProps) {
  const { src, ...rest } = props;
  return (
    <BaseCollectible {...rest}>
      <img src={src} style={{ aspectRatio: '1 / 1', objectFit: 'cover' }} />
    </BaseCollectible>
  );
}
