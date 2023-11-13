import { Box, BoxProps } from 'leather-styles/jsx';

interface MenuWrapperProps extends BoxProps {
  isShowing: boolean;
}
export function MenuWrapper({ isShowing, ...props }: MenuWrapperProps) {
  return (
    <Box
      bg="accent.background-primary"
      borderRadius="10px"
      boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08)"
      cursor={isShowing ? 'all' : 'none'}
      display={isShowing ? 'unset' : 'none'}
      position="absolute"
      py="space.02"
      right="space.06"
      top="60px"
      transformOrigin="top right"
      width="296px"
      zIndex={2000}
      {...props}
    />
  );
}
