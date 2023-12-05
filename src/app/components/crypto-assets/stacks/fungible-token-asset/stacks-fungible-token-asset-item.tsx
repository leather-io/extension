import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { FlexProps } from 'leather-styles/jsx';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';
import { Money } from '@shared/models/money.model';

import { getImageCanonicalUri } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { formatContractId, getTicker } from '@app/common/utils';
import { spamFilter } from '@app/common/utils/spam-filter';
import { getAssetName } from '@app/ui/utils/get-asset-name';

import { StacksFungibleTokenAssetItemLayout } from './stacks-fungible-token-asset-item.layout';

interface StacksFungibleTokenAssetItemProps extends FlexProps {
  assetBalance: StacksFungibleTokenAssetBalance;
  unanchoredAssetBalance?: Money;
  isPressable?: boolean;
  onClick?(): void;
}
export function StacksFungibleTokenAssetItem({
  assetBalance,
  isPressable,
  onClick,
}: StacksFungibleTokenAssetItemProps) {
  const { asset, balance } = assetBalance;
  const { contractAddress, contractAssetName, contractName, name, symbol } = asset;

  const avatar = `${formatContractId(contractAddress, contractName)}::${contractAssetName}`;
  const dataTestId =
    symbol && CryptoAssetSelectors.CryptoAssetListItem.replace('{symbol}', symbol.toLowerCase());
  const friendlyName =
    name ||
    (contractAssetName.includes('::') ? getAssetName(contractAssetName) : contractAssetName);
  const imageCanonicalUri = getImageCanonicalUri(asset.imageCanonicalUri, asset.name);
  const caption = symbol || getTicker(friendlyName);
  return (
    <StacksFungibleTokenAssetItemLayout
      avatar={avatar}
      balance={balance}
      caption={spamFilter(caption)}
      data-testid={dataTestId}
      imageCanonicalUri={imageCanonicalUri}
      isPressable={isPressable}
      title={spamFilter(friendlyName)}
      onClick={onClick}
    />
  );
}
