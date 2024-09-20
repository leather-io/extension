import { Outlet, useParams } from 'react-router-dom';

import type {
  Blockchain,
  BtcCryptoAssetBalance,
  CryptoCurrency,
  StxCryptoAssetBalance,
} from '@leather.io/models';

import { RouteUrls } from '@shared/route-urls';

import { Content } from '@app/components/layout';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { FundLayout } from './components/fund.layout';
import { FiatProvidersList } from './fiat-providers-list';

interface FundCryptoCurrencyInfo {
  address?: string;
  balance?: BtcCryptoAssetBalance | StxCryptoAssetBalance;
  blockchain: Blockchain;
  route: string;
  symbol: CryptoCurrency;
}

export function FundPage() {
  const currentStxAccount = useCurrentStacksAccount();
  const bitcoinSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const { currency = 'STX' } = useParams();

  const fundCryptoCurrencyMap: Record<CryptoCurrency, FundCryptoCurrencyInfo> = {
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

  const { address, blockchain, route, symbol } = fundCryptoCurrencyMap[currency as CryptoCurrency];

  if (!address) return <FullPageLoadingSpinner />;

  return (
    <>
      <PageHeader onBackLocation={RouteUrls.FundChooseCurrency} />
      <Content>
        <FundLayout blockchain={blockchain} symbol={symbol}>
          <FiatProvidersList address={address} route={route} symbol={symbol} />
        </FundLayout>
        <Outlet />
      </Content>
    </>
  );
}
