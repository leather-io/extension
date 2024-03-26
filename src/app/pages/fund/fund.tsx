import { Outlet, useParams } from 'react-router-dom';

import type { Blockchains } from '@shared/models/blockchain.model';
import type {
  BitcoinCryptoCurrencyAssetBalance,
  StacksCryptoCurrencyAssetBalance,
} from '@shared/models/crypto-asset-balance.model';
import type { CryptoCurrencies } from '@shared/models/currencies.model';
import { RouteUrls } from '@shared/route-urls';

import { useBtcCryptoCurrencyAssetBalance } from '@app/common/hooks/balance/btc/use-btc-crypto-currency-asset-balance';
import { useStxCryptoCurrencyAssetBalance } from '@app/common/hooks/balance/stx/use-stx-crypto-currency-asset-balance';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentAccountNativeSegwitIndexZeroSignerNullable } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { FundLayout } from './components/fund.layout';
import { FiatProvidersList } from './fiat-providers-list';

interface FundCryptoCurrencyInfo {
  address?: string;
  balance?: BitcoinCryptoCurrencyAssetBalance | StacksCryptoCurrencyAssetBalance;
  blockchain: Blockchains;
  route: string;
  symbol: CryptoCurrencies;
}

export function FundPage() {
  const currentStxAccount = useCurrentStacksAccount();
  const bitcoinSigner = useCurrentAccountNativeSegwitIndexZeroSignerNullable();
  const btcCryptoCurrencyAssetBalance = useBtcCryptoCurrencyAssetBalance();
  const stxCryptoCurrencyAssetBalance = useStxCryptoCurrencyAssetBalance();
  const { currency = 'STX' } = useParams();

  const fundCryptoCurrencyMap: Record<CryptoCurrencies, FundCryptoCurrencyInfo> = {
    BTC: {
      address: bitcoinSigner?.address,
      balance: btcCryptoCurrencyAssetBalance?.btcBalance,
      blockchain: 'Bitcoin',
      route: RouteUrls.ReceiveBtc,
      symbol: currency,
    },
    STX: {
      address: currentStxAccount?.address,
      balance: stxCryptoCurrencyAssetBalance,
      blockchain: 'Stacks',
      route: RouteUrls.ReceiveStx,
      symbol: currency,
    },
  };

  const { address, balance, blockchain, route, symbol } =
    fundCryptoCurrencyMap[currency as CryptoCurrencies];

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
