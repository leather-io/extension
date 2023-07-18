import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAllTransferableCryptoAssetBalances } from '@app/common/hooks/use-transferable-asset-balances.hooks';
import { useWalletType } from '@app/common/use-wallet-type';
import { Brc20TokensLoader } from '@app/components/brc20-tokens-loader';
import { ModalHeader } from '@app/components/modal-header';

import { Brc20TokenAssetList } from '../../../components/crypto-assets/bitcoin/brc20-token-asset-list/brc20-token-asset-list';
import { ChooseCryptoAssetLayout } from './components/choose-crypto-asset.layout';
import { CryptoAssetList } from './components/crypto-asset-list';

export function ChooseCryptoAsset() {
  const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();

  const { whenWallet } = useWalletType();

  useRouteHeader(<ModalHeader hideActions defaultGoBack title=" " />);

  return (
    <ChooseCryptoAssetLayout>
      <CryptoAssetList
        cryptoAssetBalances={allTransferableCryptoAssetBalances.filter(balance =>
          whenWallet({
            ledger: balance.asset.symbol !== 'BTC',
            software: true,
          })
        )}
      />
      {whenWallet({
        software: (
          <Brc20TokensLoader>
            {brc20Tokens => <Brc20TokenAssetList brc20Tokens={brc20Tokens} />}
          </Brc20TokensLoader>
        ),
        ledger: null,
      })}
    </ChooseCryptoAssetLayout>
  );
}
