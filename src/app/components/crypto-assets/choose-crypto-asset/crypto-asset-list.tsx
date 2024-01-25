import type { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { StacksFungibleTokenAsset } from '@shared/models/crypto-asset.model';

import { useWalletType } from '@app/common/use-wallet-type';
import { Brc20TokenAssetList } from '@app/components/crypto-assets/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';

import { CryptoAssetListItem } from './crypto-asset-list-item';
import { CryptoAssetListLayout } from './crypto-asset-list.layout';

interface CryptoAssetListProps {
  cryptoAssetBalances: AllTransferableCryptoAssetBalances[];
  onItemClick(cryptoAssetBalance: AllTransferableCryptoAssetBalances): void;
  brc20Tokens?: Brc20Token[];
}
export function CryptoAssetList({
  cryptoAssetBalances,
  onItemClick,
  brc20Tokens,
}: CryptoAssetListProps) {
  const { whenWallet } = useWalletType();

  return (
    <CryptoAssetListLayout>
      {cryptoAssetBalances.map(cryptoAssetBalance => (
        <CryptoAssetListItem
          onClick={() => onItemClick(cryptoAssetBalance)}
          assetBalance={cryptoAssetBalance}
          key={
            cryptoAssetBalance.asset.name ??
            (cryptoAssetBalance.asset as StacksFungibleTokenAsset).contractAssetName
          }
        />
      ))}
      {brc20Tokens
        ? whenWallet({
            software: <Brc20TokenAssetList brc20Tokens={brc20Tokens} />,
            ledger: null,
          })
        : null}
    </CryptoAssetListLayout>
  );
}
