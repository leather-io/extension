import { Brc20TokenAssetList } from '@app/components/crypto-assets/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { RunesAssetList } from '@app/components/crypto-assets/bitcoin/runes-asset-list/runes-asset-list';
import { Src20TokenAssetList } from '@app/components/crypto-assets/bitcoin/src20-token-asset-list/src20-token-asset-list';
import { Brc20TokensLoader } from '@app/components/loaders/brc20-tokens-loader';
import { RunesLoader } from '@app/components/loaders/runes-loader';
import { Src20TokensLoader } from '@app/components/loaders/src20-tokens-loader';

interface BitcoinFungibleTokenAssetListProps {
  btcAddressNativeSegwit: string;
  btcAddressTaproot: string;
}
export function BitcoinFungibleTokenAssetList({
  btcAddressNativeSegwit,
  btcAddressTaproot,
}: BitcoinFungibleTokenAssetListProps) {
  return (
    <>
      <Brc20TokensLoader>
        {brc20Tokens => <Brc20TokenAssetList brc20Tokens={brc20Tokens} />}
      </Brc20TokensLoader>
      <Src20TokensLoader address={btcAddressNativeSegwit}>
        {src20Tokens => <Src20TokenAssetList src20Tokens={src20Tokens} />}
      </Src20TokensLoader>
      <RunesLoader address={btcAddressTaproot}>
        {runes => <RunesAssetList runes={runes} />}
      </RunesLoader>
    </>
  );
}
