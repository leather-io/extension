import { Box } from 'leather-styles/jsx';

interface ActivityListTabWrapperProps {
  children: React.ReactNode;
  padContent?: boolean;
}

export function ActivityListTabWrapper({
  children,
  padContent = false,
}: ActivityListTabWrapperProps) {
  return (
    // Height set based on the height of the empty assets screen
    <Box minHeight="477px" py={padContent ? 'space.11' : undefined}>
      {children}
    </Box>
  );
}
