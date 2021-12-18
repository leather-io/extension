interface ImageProps {
  src?: string;
  alt?: string;
  title?: string;
  id?: string;
}

export const Image = (props: ImageProps) => {
  return (
    <img
      style={{
        maxWidth: '100%',
        display: 'block',
      }}
      {...props}
    />
  );
};
