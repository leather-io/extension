import { BoxProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';
import { getAssetName } from '@stacks/ui-utils';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';
import { Money } from '@shared/models/money.model';

import { getImageCanonicalUri } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { formatContractId, getTicker } from '@app/common/utils';

import { StacksFungibleTokenAssetItemLayout } from './stacks-fungible-token-asset-item.layout';

interface StacksFungibleTokenAssetItemProps extends BoxProps {
  assetBalance: StacksFungibleTokenAssetBalance;
  unanchoredAssetBalance?: Money;
  isPressable?: boolean;
}
export const StacksFungibleTokenAssetItem = forwardRefWithAs(
  (props: StacksFungibleTokenAssetItemProps, ref) => {
    const { assetBalance, unanchoredAssetBalance, ...rest } = props;
    const { asset, balance } = assetBalance;
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
        ref={ref}
        subBalance={unanchoredAssetBalance}
        title={friendlyName}
        {...rest}
      />
    );
  }
);
