interface ImageProps {
  src?: string;
  alt?: string;
  title?: string;
  id?: string;
}

export function Image(props: ImageProps) {
  return (
    <img
      style={{
        maxWidth: '100%',
        display: 'block',
      }}
      {...props}
    />
  );
}
