import { useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';
import { isDefined } from '@shared/utils';

import { useStxCryptoCurrencyAssetBalance } from '@app/common/hooks/balance/stx/use-stx-crypto-currency-asset-balance';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { ChooseAssetContainer } from '@app/components/crypto-assets/choose-crypto-asset/choose-asset-container';
import { ChooseCryptoAssetLayout } from '@app/components/crypto-assets/choose-crypto-asset/choose-crypto-asset.layout';
import { CryptoAssetList } from '@app/components/crypto-assets/choose-crypto-asset/crypto-asset-list';
import { ModalHeader } from '@app/components/modal-header';
import { useCheckLedgerBlockchainAvailable } from '@app/store/accounts/blockchain/utils';

export function ChooseCryptoAssetToFund() {
  const stxCryptoCurrencyAssetBalance = useStxCryptoCurrencyAssetBalance();

  const { whenWallet } = useWalletType();
  const navigate = useNavigate();

  const checkBlockchainAvailable = useCheckLedgerBlockchainAvailable();

  const filteredCryptoAssetBalances = useMemo(
    () =>
      [stxCryptoCurrencyAssetBalance].filter(isDefined).filter(assetBalance =>
        whenWallet({
          ledger: checkBlockchainAvailable(assetBalance?.blockchain),
          software: true,
        })
      ),
    [stxCryptoCurrencyAssetBalance, checkBlockchainAvailable, whenWallet]
  );

  useRouteHeader(<ModalHeader hideActions onGoBack={() => navigate(RouteUrls.Home)} title=" " />);

  const navigateToSendForm = useCallback(
    (cryptoAssetBalance: AllTransferableCryptoAssetBalances) => {
      const { asset } = cryptoAssetBalance;

      const symbol = asset.symbol === '' ? asset.contractAssetName : asset.symbol;
      navigate(RouteUrls.Fund.replace(':currency', symbol.toUpperCase()));
    },
    [navigate]
  );

  return (
    <>
      <ChooseAssetContainer>
        <ChooseCryptoAssetLayout title="choose asset to fund">
          <CryptoAssetList
            onItemClick={navigateToSendForm}
            cryptoAssetBalances={filteredCryptoAssetBalances}
          />
        </ChooseCryptoAssetLayout>
      </ChooseAssetContainer>
      <Outlet />
    </>
  );
}
