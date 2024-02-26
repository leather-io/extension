import { Box, BoxProps } from 'leather-styles/jsx';

export function LoadingRectangle(props: BoxProps) {
  return (
    <Box
      animation="shine 5s infinite linear"
      backgroundColor="ink.background-secondary"
      backgroundImage="linear-gradient(90deg, rgba(219,219,219,1) 0%, rgba(192,192,247,0.5) 35%, rgba(219,219,219,1) 100%)"
      {...props}
    />
  );
}
