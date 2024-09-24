import { useLocation, useNavigate } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { CollectibleItemLayout, PlusIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

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
      testId={SendCryptoAssetSelectors.InscriptionSendButton}
    >
      <PlusIcon height={36} width={36} />
    </CollectibleItemLayout>
  );
}
