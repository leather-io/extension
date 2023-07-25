import { useLocation, useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { Plus } from '@app/components/icons/plus';

import { CollectibleItemLayout } from './collectible-item.layout';

const backgroundProps = {
  backgroundColor: 'white',
  border: '2px dashed #DCDDE2',
  borderRadius: '16px',
  _hover: {
    cursor: 'pointer',
    backgroundColor: '#F9F9FA',
  },
  _active: {
    backgroundColor: '#EFEFF2',
  },
};

export function AddCollectible() {
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const location = useLocation();

  return (
    <CollectibleItemLayout
      backgroundElementProps={backgroundProps}
      onClickLayout={() => {
        void analytics.track('select_add_new_collectible');
        navigate(`${RouteUrls.Receive}/${RouteUrls.ReceiveCollectible}`, {
          state: {
            backgroundLocation: location,
          },
        });
      }}
      subtitle="Collectible"
      title="Add new"
    >
      <Box as={Plus} width="40px" />
    </CollectibleItemLayout>
  );
}
