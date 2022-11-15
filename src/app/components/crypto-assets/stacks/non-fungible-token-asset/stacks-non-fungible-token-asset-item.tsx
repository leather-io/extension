import { forwardRef } from 'react';

import { StackProps } from '@stacks/ui';
import { getAssetName } from '@stacks/ui-utils';

import type { StacksNonFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { getImageCanonicalUri } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { formatContractId } from '@app/common/utils';

import { StacksNonFungibleTokenAssetItemLayout } from './stacks-non-fungible-token-asset-item.layout';

// TODO: This is temporarily a copy of the fungible token component
// New designs for this will be implemented when the nft api endpoint is available
interface StacksNonFungibleTokenAssetItemProps extends StackProps {
  assetBalance: StacksNonFungibleTokenAssetBalance;
}
export const StacksNonFungibleTokenAssetItem = forwardRef(
  (props: StacksNonFungibleTokenAssetItemProps, ref) => {
    const { assetBalance, ...rest } = props;
    const { asset, count } = assetBalance;
    const { contractAddress, contractAssetName, contractName, name } = asset;

    const avatar = `${formatContractId(contractAddress, contractName)}::${contractAssetName}`;
    const friendlyName =
      name ||
      (contractAssetName.includes('::') ? getAssetName(contractAssetName) : contractAssetName);
    const imageCanonicalUri = getImageCanonicalUri(asset.imageCanonicalUri, asset.name);

    return (
      <StacksNonFungibleTokenAssetItemLayout
        avatar={avatar}
        count={count}
        caption={contractName}
        data-testid={`asset-${name}`}
        imageCanonicalUri={imageCanonicalUri}
        name={name}
        ref={ref}
        title={friendlyName}
        {...(rest as any)}
      />
    );
  }
);
