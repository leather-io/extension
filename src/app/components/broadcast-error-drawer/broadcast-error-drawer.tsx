import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { BroadcastErrorDrawerLayout } from './broadcast-error-drawer.layout';

export function BroadcastErrorDrawer() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <BroadcastErrorDrawerLayout
      message={get(location.state, 'message', '')}
      onClose={() => navigate('..')}
    />
  );
}
