import { ActivitySelectors } from '@tests/selectors/activity.selectors';
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
    <Box
      minHeight="dialogContentHeight"
      py={padContent ? 'space.11' : undefined}
      data-testid={ActivitySelectors.ActivityList}
    >
      {children}
    </Box>
  );
}
