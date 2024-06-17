import { useLocation, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { PlusIcon } from '@app/ui/icons/plus-icon';

import { CollectibleItemLayout } from './collectible-item.layout';

export function AddCollectible() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <CollectibleItemLayout
      onClickLayout={() => {
        void analytics.track('select_add_new_collectible');
        navigate(`${RouteUrls.Home}${RouteUrls.ReceiveCollectible}`, {
          state: {
            backgroundLocation: location,
          },
        });
      }}
      showBorder
      subtitle="Collectible"
      title="Add new"
    >
      <PlusIcon height="auto" width="xl" />
    </CollectibleItemLayout>
  );
}
