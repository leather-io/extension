import BinanceIcon from '@assets/images/fund/fiat-providers/binance-icon.png';
import BlockchainComIcon from '@assets/images/fund/fiat-providers/blockchain.com-icon.png';
import ByBitIcon from '@assets/images/fund/fiat-providers/bybit-icon.png';
import CoinbaseIcon from '@assets/images/fund/fiat-providers/coinbase-icon.png';
import CryptoComIcon from '@assets/images/fund/fiat-providers/crypto.com-icon.png';
import GateIoIcon from '@assets/images/fund/fiat-providers/gate.io-icon.png';
import KuCoinIcon from '@assets/images/fund/fiat-providers/kucoin-icon.png';
import MoonPayIcon from '@assets/images/fund/fiat-providers/moonpay-icon.png';
import OkxIcon from '@assets/images/fund/fiat-providers/okx-icon.png';
import TransakIcon from '@assets/images/fund/fiat-providers/transak-icon.png';
import { generateOnRampURL } from '@coinbase/cbpay-js';

import type { CryptoCurrency } from '@leather.io/models';

import { COINBASE_APP_ID, MOONPAY_API_KEY, TRANSAK_API_KEY } from '@shared/environment';

import { ActiveFiatProvider } from '@app/query/common/remote-config/remote-config.query';

// Keys are set in wallet-config.json
enum ActiveFiatProviders {
  Binance = 'binance',
  BlockchainCom = 'blockchainCom',
  ByBit = 'byBit',
  Coinbase = 'coinbase',
  CryptoCom = 'cryptoCom',
  GateIo = 'gateIo',
  KuCoin = 'kuCoin',
  MoonPay = 'moonPay',
  Okx = 'okx',
  Transak = 'transak',
}

export const activeFiatProviderIcons: Record<ActiveFiatProvider['name'], string> = {
  [ActiveFiatProviders.Binance]: BinanceIcon,
  [ActiveFiatProviders.BlockchainCom]: BlockchainComIcon,
  [ActiveFiatProviders.ByBit]: ByBitIcon,
  [ActiveFiatProviders.Coinbase]: CoinbaseIcon,
  [ActiveFiatProviders.CryptoCom]: CryptoComIcon,
  [ActiveFiatProviders.GateIo]: GateIoIcon,
  [ActiveFiatProviders.KuCoin]: KuCoinIcon,
  [ActiveFiatProviders.MoonPay]: MoonPayIcon,
  [ActiveFiatProviders.Okx]: OkxIcon,
  [ActiveFiatProviders.Transak]: TransakIcon,
};

function makeCoinbaseUrl(address: string, symbol: CryptoCurrency) {
  const code = symbol.toUpperCase();

  const onRampURL = generateOnRampURL({
    appId: COINBASE_APP_ID,
    destinationWallets: [
      {
        address,
        assets: [code],
      },
    ],
  });
  return onRampURL;
}

function makeMoonPayUrl(address: string, symbol: CryptoCurrency) {
  const code = symbol.toLowerCase();
  return `https://buy.moonpay.com?apiKey=${MOONPAY_API_KEY}&currencyCode=${code}&walletAddress=${address}`;
}

function makeTransakUrl(address: string, symbol: CryptoCurrency) {
  const screenTitle = 'Buy Stacks';
  const code = symbol.toUpperCase();

  return `https://global.transak.com?apiKey=${TRANSAK_API_KEY}&cryptoCurrencyCode=${code}&exchangeScreenTitle=${encodeURI(
    screenTitle
  )}&defaultPaymentMethod=credit_debit_card&walletAddress=${address}`;
}

function makeFiatProviderFaqUrl(address: string, provider: string) {
  // TODO: Add FAQ for BTC
  return `https://hiro.so/wallet-faq/how-do-i-buy-stx-from-an-exchange?provider=${provider}&address=${address}`;
}

interface GetProviderNameArgs {
  address: string;
  hasFastCheckoutProcess: boolean;
  key: string;
  name: string;
  symbol: CryptoCurrency;
}
export function getProviderUrl({
  address,
  hasFastCheckoutProcess,
  key,
  name,
  symbol,
}: GetProviderNameArgs) {
  if (!hasFastCheckoutProcess) {
    return makeFiatProviderFaqUrl(address, name);
  }
  switch (key) {
    case ActiveFiatProviders.Coinbase:
      return makeCoinbaseUrl(address, symbol);
    case ActiveFiatProviders.MoonPay:
      return makeMoonPayUrl(address, symbol);
    case ActiveFiatProviders.Transak:
      return makeTransakUrl(address, symbol);
    default:
      return makeFiatProviderFaqUrl(address, name);
  }
}
