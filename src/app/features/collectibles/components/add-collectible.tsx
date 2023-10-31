import { useLocation, useNavigate } from 'react-router-dom';

import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { PlusIcon } from '@app/ui/components/icons/plus-icon';

import { CollectibleItemLayout } from './collectible-item.layout';

const backgroundProps = {
  backgroundColor: token('colors.brown.1'),
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
        navigate(`${RouteUrls.Home}${RouteUrls.ReceiveCollectible}`, {
          state: {
            backgroundLocation: location,
          },
        });
      }}
      subtitle="Collectible"
      title="Add new"
    >
      <PlusIcon size="40px" />
    </CollectibleItemLayout>
  );
}
