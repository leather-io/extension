import { useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Plus } from '@app/components/icons/plus';

import { BaseCollectible } from './components/base-collectible';

export function AddCollectibles() {
  const navigate = useNavigate();
  const analytics = useAnalytics();

  return (
    <BaseCollectible
      backgroundElementProps={{
        backgroundColor: 'white',
        border: '2px dashed #DCDDE2',
        borderRadius: '16px',
        _hover: {
          cursor: 'pointer',
          backgroundColor: '#F9F9FA', // Couldn't find this color in `@stacks/ui`
        },
        _active: {
          backgroundColor: '#EFEFF2', // Couldn't find this color in `@stacks/ui`
        },
      }}
      title="Add new"
      subtitle="Ordinal inscription"
      onClick={() => {
        analytics.track('select_add_new_collectible');
        navigate(RouteUrls.ReceiveCollectible);
      }}
    >
      <Box width="40px">
        <Plus />
      </Box>
    </BaseCollectible>
  );
}
