interface InscriptionImageProps {
  src: string;
}
export function InscriptionImage({ src }: InscriptionImageProps) {
  return (
    <img
      src={src}
      style={{ width: '100%', height: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
    />
  );
}
