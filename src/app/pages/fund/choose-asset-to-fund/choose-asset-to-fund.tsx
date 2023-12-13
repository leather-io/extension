import { useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWalletType } from '@app/common/use-wallet-type';
import { ChooseAssetContainer } from '@app/components/crypto-assets/choose-crypto-asset/choose-asset-container';
import { ChooseCryptoAssetLayout } from '@app/components/crypto-assets/choose-crypto-asset/choose-crypto-asset.layout';
import { CryptoAssetList } from '@app/components/crypto-assets/choose-crypto-asset/crypto-asset-list';
import { ModalHeader } from '@app/components/modal-header';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCheckLedgerBlockchainAvailable } from '@app/store/accounts/blockchain/utils';

function useBtcCryptoCurrencyAssetBalance() {
  const currentBtcSigner = useCurrentAccountNativeSegwitSigner();
  if (!currentBtcSigner?.(0).address) throw new Error('No bitcoin address');

  return useNativeSegwitBalance(currentBtcSigner?.(0).address);
}

function useStxCryptoCurrencyAssetBalance() {
  const { availableBalance: availableStxBalance } = useStxBalance();
  return createStacksCryptoCurrencyAssetTypeWrapper(availableStxBalance.amount);
}

export function ChooseCryptoAssetToFund() {
  const btcCryptoCurrencyAssetBalance = useBtcCryptoCurrencyAssetBalance();
  const stxCryptoCurrencyAssetBalance = useStxCryptoCurrencyAssetBalance();

  const cryptoCurrencyAssetBalances = useMemo(
    () => [btcCryptoCurrencyAssetBalance, stxCryptoCurrencyAssetBalance],
    [btcCryptoCurrencyAssetBalance, stxCryptoCurrencyAssetBalance]
  );

  const { whenWallet } = useWalletType();
  const navigate = useNavigate();

  const checkBlockchainAvailable = useCheckLedgerBlockchainAvailable();

  const filteredCryptoAssetBalances = useMemo(
    () =>
      cryptoCurrencyAssetBalances.filter(assetBalance =>
        whenWallet({
          ledger: checkBlockchainAvailable(assetBalance.blockchain),
          software: true,
        })
      ),
    [cryptoCurrencyAssetBalances, checkBlockchainAvailable, whenWallet]
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
