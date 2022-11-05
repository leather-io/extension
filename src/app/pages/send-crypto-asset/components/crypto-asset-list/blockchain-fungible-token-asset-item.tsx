import { useNavigate } from 'react-router-dom';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';

export function BlockchainFungibleTokenAssetItem(props: {
  assetBalance: StacksFungibleTokenAssetBalance;
}) {
  const { assetBalance } = props;
  const navigate = useNavigate();
  const { blockchain, type } = assetBalance;

  switch (blockchain) {
    case 'stacks':
      return (
        <StacksFungibleTokenAssetItem
          assetBalance={assetBalance}
          isPressable
          onClick={() =>
            navigate(`${RouteUrls.SendCryptoAsset}/${blockchain}/${type}`, {
              state: { assetBalance },
            })
          }
        />
      );
    default:
      return null;
  }
}
