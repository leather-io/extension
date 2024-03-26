import { Brc20TokensLoader } from '@app/components/brc20-tokens-loader';
import { Brc20TokenAssetList } from '@app/components/crypto-assets/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { Src20TokenAssetList } from '@app/components/crypto-assets/bitcoin/src20-token-asset-list/src20-token-asset-list';
import { Src20TokensLoader } from '@app/components/src20-tokens-loader';

interface BitcoinFungibleTokenAssetListProps {
  btcAddress: string;
}
export function BitcoinFungibleTokenAssetList({ btcAddress }: BitcoinFungibleTokenAssetListProps) {
  return (
    <>
      <Brc20TokensLoader>
        {brc20Tokens => <Brc20TokenAssetList brc20Tokens={brc20Tokens} />}
      </Brc20TokensLoader>
      <Src20TokensLoader address={btcAddress}>
        {src20Tokens => <Src20TokenAssetList src20Tokens={src20Tokens} />}
      </Src20TokensLoader>
    </>
  );
}
