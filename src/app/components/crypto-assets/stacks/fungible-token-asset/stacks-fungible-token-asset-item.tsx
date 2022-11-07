import { forwardRef } from 'react';
import { StackProps } from '@stacks/ui';
import { getAssetName } from '@stacks/ui-utils';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';
import { formatContractId, getTicker } from '@app/common/utils';
import { getImageCanonicalUri } from '@app/common/crypto-assets/stacks-crypto-asset.utils';

import { StacksFungibleTokenAssetItemLayout } from './stacks-fungible-token-asset-item.layout';

interface StacksFungibleTokenAssetItemProps extends StackProps {
  assetBalance: StacksFungibleTokenAssetBalance;
}
export const StacksFungibleTokenAssetItem = forwardRef(
  (props: StacksFungibleTokenAssetItemProps, ref) => {
    const { assetBalance, ...rest } = props;
    const { asset, balance, subBalance } = assetBalance;
    const { contractAddress, contractAssetName, contractName, name, symbol } = asset;

    const avatar = `${formatContractId(contractAddress, contractName)}::${contractAssetName}`;
    const friendlyName =
      name ||
      (contractAssetName.includes('::') ? getAssetName(contractAssetName) : contractAssetName);
    const imageCanonicalUri = getImageCanonicalUri(asset.imageCanonicalUri, asset.name);
    const caption = symbol || getTicker(friendlyName);

    return (
      <StacksFungibleTokenAssetItemLayout
        avatar={avatar}
        balance={balance}
        caption={caption}
        data-testid={`asset-${name}`}
        imageCanonicalUri={imageCanonicalUri}
        name={name}
        ref={ref}
        subBalance={subBalance}
        title={friendlyName}
        {...(rest as any)}
      />
    );
  }
);
