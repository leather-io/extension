interface ImageCollectibleProps {
  src: string;
}
export function CollectibleImageLayout({ src }: ImageCollectibleProps) {
  return (
    <img
      src={src}
      style={{ width: '100%', height: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
    />
  );
}
