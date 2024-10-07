import { Outlet } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { AssetList } from '@app/features/asset-list/asset-list';
import { Collectibles } from '@app/features/collectibles/collectibles';

export function Assets() {
  return (
    <Stack data-testid={HomePageSelectors.AssetList}>
      <AssetList />
      <Collectibles />
      <Outlet />
    </Stack>
  );
}
