import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { BaseCollectible } from './components/base-collectible';

export function AddCollectibles() {
  const navigate = useNavigate();

  return (
    <BaseCollectible
      backgroundElementProps={{
        backgroundColor: '#EEF2FB', // NOTE: color not yet available from `@stacks/ui`.
      }}
      title="Add new"
      subtitle="Ordinal inscription"
      onClick={() => navigate(RouteUrls.ReceiveCollectible)}
    >
      <FiPlus />
    </BaseCollectible>
  );
}
