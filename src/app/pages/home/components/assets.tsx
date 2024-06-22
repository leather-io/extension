import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { AssetList } from '@app/features/asset-list/asset-list';
import { Collectibles } from '@app/features/collectibles/collectibles';
import { ManageTokensDialog } from '@app/features/manage-tokens/manage-tokens';
import { PendingBrc20TransferList } from '@app/features/pending-brc-20-transfers/pending-brc-20-transfers';

import { ManageTokensButton } from './manage-tokens-button';

export function Assets() {
  const [showManageTokens, setShowManageTokens] = useState(false);
  return (
    <Stack data-testid={HomePageSelectors.AssetList}>
      <AssetList />
      <ManageTokensButton
        showManageTokens={showManageTokens}
        setShowManageTokens={setShowManageTokens}
      />
      <PendingBrc20TransferList />
      <Collectibles />
      <Outlet />
      {showManageTokens && (
        <ManageTokensDialog onClose={() => setShowManageTokens(!showManageTokens)} />
      )}
    </Stack>
  );
}
