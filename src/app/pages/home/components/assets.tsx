import { Outlet } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { AssetList } from '@app/features/asset-list/asset-list';
import { ManageTokens } from '@app/features/asset-list/manage-tokens/manage-tokens';
import { Collectibles } from '@app/features/collectibles/collectibles';

export function Assets() {
  return (
    <Stack data-testid={HomePageSelectors.AssetList}>
      <AssetList filter="enabled" />
      <ManageTokens />
      <Collectibles />
      <Outlet />
    </Stack>
  );
}
