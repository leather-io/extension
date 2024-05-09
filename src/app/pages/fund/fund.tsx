import { Outlet, useParams } from 'react-router-dom';

import type { BtcCryptoAssetBalance, StxCryptoAssetBalance } from '@leather-wallet/models';

import type { Blockchains } from '@shared/models/blockchain.model';
import type { CryptoCurrencies } from '@shared/models/currencies.model';
import { RouteUrls } from '@shared/route-urls';

import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useStxCryptoAssetBalance } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { FundLayout } from './components/fund.layout';
import { FiatProvidersList } from './fiat-providers-list';

interface FundCryptoCurrencyInfo {
  address?: string;
  balance?: BtcCryptoAssetBalance | StxCryptoAssetBalance;
  blockchain: Blockchains;
  route: string;
  symbol: CryptoCurrencies;
}

export function FundPage() {
  const currentStxAccount = useCurrentStacksAccount();
  const bitcoinSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const { btcCryptoAssetBalance } = useBtcCryptoAssetBalanceNativeSegwit(
    bitcoinSigner?.address ?? ''
  );
  const { data: stxCryptoAssetBalance } = useStxCryptoAssetBalance(
    currentStxAccount?.address ?? ''
  );
  const { currency = 'STX' } = useParams();

  const fundCryptoCurrencyMap: Record<CryptoCurrencies, FundCryptoCurrencyInfo> = {
    BTC: {
      address: bitcoinSigner?.address,
      balance: btcCryptoAssetBalance,
      blockchain: 'Bitcoin',
      route: RouteUrls.ReceiveBtc,
      symbol: currency,
    },
    STX: {
      address: currentStxAccount?.address,
      balance: stxCryptoAssetBalance,
      blockchain: 'Stacks',
      route: RouteUrls.ReceiveStx,
      symbol: currency,
    },
  };

  const { address, balance, blockchain, route, symbol } =
    fundCryptoCurrencyMap[currency as CryptoCurrencies];

  // TODO: Asset refactor: Why is the balance needed here?
  if (!address || !balance) return <FullPageLoadingSpinner />;

  return (
    <>
      <FundLayout blockchain={blockchain} symbol={symbol}>
        <FiatProvidersList address={address} route={route} symbol={symbol} />
      </FundLayout>
      <Outlet />
    </>
  );
}
