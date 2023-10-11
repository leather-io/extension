import { Box } from 'leather-styles/jsx';

interface TabWrapperProps {
  children: React.ReactNode;
  padContent?: boolean;
}

export function TabWrapper({ children, padContent = false }: TabWrapperProps) {
  return (
    // Height set based on the height of the empty assets screen
    <Box minHeight="477px" py={padContent ? 'space.11' : undefined}>
      {children}
    </Box>
  );
}
