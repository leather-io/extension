import { Outlet, useParams } from 'react-router-dom';

import type {
  Blockchains,
  BtcCryptoAssetBalance,
  CryptoCurrencies,
  StxCryptoAssetBalance,
} from '@leather.io/models';

import { RouteUrls } from '@shared/route-urls';

import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useUpdatePageHeaderContext } from '@app/features/container/containers/page/page.context';
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
  const { currency = 'STX' } = useParams();
  useUpdatePageHeaderContext({
    onBackLocation: RouteUrls.FundChooseCurrency,
  });

  const fundCryptoCurrencyMap: Record<CryptoCurrencies, FundCryptoCurrencyInfo> = {
    BTC: {
      address: bitcoinSigner?.address,
      blockchain: 'bitcoin',
      route: RouteUrls.ReceiveBtc,
      symbol: currency,
    },
    STX: {
      address: currentStxAccount?.address,
      blockchain: 'stacks',
      route: RouteUrls.ReceiveStx,
      symbol: currency,
    },
  };

  const { address, blockchain, route, symbol } =
    fundCryptoCurrencyMap[currency as CryptoCurrencies];

  if (!address) return <FullPageLoadingSpinner />;

  return (
    <>
      <FundLayout blockchain={blockchain} symbol={symbol}>
        <FiatProvidersList address={address} route={route} symbol={symbol} />
      </FundLayout>
      <Outlet />
    </>
  );
}
