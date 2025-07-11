import { useLocation, useNavigate } from 'react-router';

import { PlusIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { CollectibleItemLayout } from '../../../components/collectibles/collectible-item.layout';

export function AddCollectible() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <CollectibleItemLayout
      onClickLayout={() => {
        void analytics.track('select_add_new_collectible');
        void navigate(`${RouteUrls.Home}${RouteUrls.ReceiveCollectible}`, {
          state: {
            backgroundLocation: location,
          },
        });
      }}
      showBorder
      subtitle="Collectible"
      title="Add new"
    >
      <PlusIcon height={36} width={36} />
    </CollectibleItemLayout>
  );
}
