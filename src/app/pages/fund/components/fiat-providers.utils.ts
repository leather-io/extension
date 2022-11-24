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

import { COINBASE_APP_ID, MOONPAY_API_KEY, TRANSAK_API_KEY } from '@shared/environment';

import { ActiveFiatProvider } from '@app/query/common/hiro-config/hiro-config.query';

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

function makeCoinbaseUrl(address: string) {
  const onRampURL = generateOnRampURL({
    appId: COINBASE_APP_ID,
    destinationWallets: [
      {
        address,
        assets: ['STX'],
      },
    ],
  });
  return onRampURL;
}

function makeMoonPayUrl(address: string) {
  return `https://buy.moonpay.com?apiKey=${MOONPAY_API_KEY}&currencyCode=stx&walletAddress=${address}`;
}

function makeTransakUrl(address: string) {
  const screenTitle = 'Buy Stacks';

  return `https://global.transak.com?apiKey=${TRANSAK_API_KEY}&cryptoCurrencyCode=STX&exchangeScreenTitle=${encodeURI(
    screenTitle
  )}&defaultPaymentMethod=credit_debit_card&walletAddress=${address}`;
}

function makeFiatProviderFaqUrl(address: string, provider: string) {
  return `https://hiro.so/wallet-faq/how-do-i-buy-stx-from-an-exchange?provider=${provider}&address=${address}`;
}

interface GetProviderNameArgs {
  address: string;
  hasFastCheckoutProcess: boolean;
  key: string;
  name: string;
}
export function getProviderUrl({
  address,
  hasFastCheckoutProcess,
  key,
  name,
}: GetProviderNameArgs) {
  if (!hasFastCheckoutProcess) {
    return makeFiatProviderFaqUrl(address, name);
  }
  switch (key) {
    case ActiveFiatProviders.Coinbase:
      return makeCoinbaseUrl(address);
    case ActiveFiatProviders.MoonPay:
      return makeMoonPayUrl(address);
    case ActiveFiatProviders.Transak:
      return makeTransakUrl(address);
    default:
      return makeFiatProviderFaqUrl(address, name);
  }
}
