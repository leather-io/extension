import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';

import { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { useAllTransferableCryptoAssetBalances } from '@app/common/hooks/use-transferable-asset-balances.hooks';
import { useWalletType } from '@app/common/use-wallet-type';
import { CryptoAssetList } from '@app/components/crypto-assets/choose-crypto-asset/crypto-asset-list';
import { useConfigBitcoinSendEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCheckLedgerBlockchainAvailable } from '@app/store/accounts/blockchain/utils';
import { Card } from '@app/ui/layout/card/card';

export function ChooseCryptoAsset() {
  const allTransferableCryptoAssetBalances = useAllTransferableCryptoAssetBalances();

  const { whenWallet } = useWalletType();
  const navigate = useNavigate();
  const isBitcoinSendEnabled = useConfigBitcoinSendEnabled();

  const checkBlockchainAvailable = useCheckLedgerBlockchainAvailable();

  function navigateToSendForm(cryptoAssetBalance: AllTransferableCryptoAssetBalances) {
    const { asset } = cryptoAssetBalance;
    if (asset.symbol === 'BTC' && !isBitcoinSendEnabled) {
      return navigate(RouteUrls.SendBtcDisabled);
    }
    const symbol = asset.symbol === '' ? asset.contractAssetName : asset.symbol.toLowerCase();

    if (cryptoAssetBalance.type === 'fungible-token') {
      const asset = cryptoAssetBalance.asset;
      if (!asset.contractId) {
        toast.error('Unable to find contract id');
        return navigate('..');
      }
      const contractId = `${asset.contractId.split('::')[0]}`;
      return navigate(`${RouteUrls.SendCryptoAsset}/${symbol}/${contractId}`);
    }
    navigate(`${RouteUrls.SendCryptoAsset}/${symbol}`);
  }

  return (
    <Card
      header={
        <styled.h1 textStyle="heading.03" p="space.05">
          choose asset <br /> to send
        </styled.h1>
      }
    >
      <CryptoAssetList
        onItemClick={cryptoAssetBalance => navigateToSendForm(cryptoAssetBalance)}
        cryptoAssetBalances={allTransferableCryptoAssetBalances.filter(asset =>
          whenWallet({
            ledger: checkBlockchainAvailable(asset.blockchain),
            software: true,
          })
        )}
      />
    </Card>
  );
}
