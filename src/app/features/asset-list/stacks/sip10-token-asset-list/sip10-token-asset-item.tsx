import { type Sip10TokenAssetDetails, useAlexCurrencyPriceAsMarketData } from '@leather.io/query';
import { getPrincipalFromContractId } from '@leather.io/utils';

import type { RightElementVariant } from '@app/common/asset-list-utils';
import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { CryptoAssetItemBalanceLayout } from '@app/components/crypto-asset-item/crypto-asset-item-balance.layout';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';

interface Sip10TokenAssetItemProps {
  token: Sip10TokenAssetDetails;
  isLoading?: boolean;
  onSelectAsset?(symbol: string, contractId?: string): void;
  rightElementVariant: RightElementVariant;
}

export function Sip10TokenAssetItem({
  isLoading = false,
  onSelectAsset,
  token,
  rightElementVariant = 'balance',
}: Sip10TokenAssetItemProps) {
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();
  const { contractId, imageCanonicalUri, name, symbol } = token.info;

  const icon = (
    <StacksAssetAvatar
      color="white"
      gradientString={contractId}
      imageCanonicalUri={getSafeImageCanonicalUri(imageCanonicalUri, name)}
    >
      {name[0]}
    </StacksAssetAvatar>
  );

  if (rightElementVariant === 'toggle') {
    return (
      <CryptoAssetItemToggleLayout
        captionLeft={symbol}
        titleLeft={name}
        contractId={token.info.contractId}
        icon={icon}
      />
    );
  }

  const balance = token.balance;
  const marketData = priceAsMarketData(
    getPrincipalFromContractId(token.info.contractId),
    token.balance.availableBalance.symbol
  );
  const fiatBalance = convertAssetBalanceToFiat({
    balance: balance.availableBalance,
    marketData,
  });

  return (
    <CryptoAssetItemBalanceLayout
      availableBalance={balance.availableBalance}
      fiatBalance={fiatBalance}
      captionLeft={symbol}
      contractId={contractId}
      icon={icon}
      isLoading={isLoading}
      onSelectAsset={onSelectAsset}
      titleLeft={name}
    />
  );
}
