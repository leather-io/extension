import { Box } from 'leather-styles/jsx';

export function IconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      width="40px"
      height="40px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="100%"
      background="ink.component-background-hover"
      border="1px solid"
      borderColor="ink.component-background-hover"
      p="space.02"
    >
      {children}
    </Box>
  );
}
