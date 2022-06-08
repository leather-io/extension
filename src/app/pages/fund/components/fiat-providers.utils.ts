import { ActiveFiatProvider } from '@app/query/hiro-config/hiro-config.query';
import BinanceIcon from '@assets/images/fund/fiat-providers/binance-icon.png';
import BlockchainComIcon from '@assets/images/fund/fiat-providers/blockchain.com-icon.png';
import ByBitIcon from '@assets/images/fund/fiat-providers/bybit-icon.png';
import CoinbaseIcon from '@assets/images/fund/fiat-providers/coinbase-icon.png';
import CryptoComIcon from '@assets/images/fund/fiat-providers/crypto.com-icon.png';
import GateIoIcon from '@assets/images/fund/fiat-providers/gate.io-icon.png';
import KuCoinIcon from '@assets/images/fund/fiat-providers/kucoin-icon.png';
import MoonPayIcon from '@assets/images/fund/fiat-providers/moonpay-icon.png';
import OkcoinIcon from '@assets/images/fund/fiat-providers/okcoin-icon.png';
import OkxIcon from '@assets/images/fund/fiat-providers/okx-icon.png';
import TransakIcon from '@assets/images/fund/fiat-providers/transak-icon.png';
import {
  IS_PRODUCTION_ENV,
  MOONPAY_API_KEY_PRODUCTION,
  TRANSAK_API_KEY_PRODUCTION,
  TRANSAK_API_KEY_STAGING,
} from '@shared/constants';

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
  Okcoin = 'okcoin',
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
  [ActiveFiatProviders.Okcoin]: OkcoinIcon,
  [ActiveFiatProviders.Okx]: OkxIcon,
  [ActiveFiatProviders.Transak]: TransakIcon,
};

function makeMoonPayUrl(address: string) {
  return `https://buy.moonpay.com?apiKey=${MOONPAY_API_KEY_PRODUCTION}&currencyCode=stx&walletAddress=${address}`;
}

function makeOkcoinUrl(address: string) {
  const successBackLink = encodeURI(`https://explorer.stacks.co/address/${address}?chain=mainnet`);
  const thirdPartyLink = encodeURI('https://hiro.so');

  return `https://www.okcoin.com/bridge/thirdBridge?isThirdBridge=1&partnerId=10002&crypto=STX&address=${address}&thirdPartyName=Hiro&fiatAmount=100&currency=USD&successBackLink=${successBackLink}&thirdPartyLink=${thirdPartyLink}`;
}

function makeTransakUrl(address: string) {
  const apiKey = IS_PRODUCTION_ENV ? TRANSAK_API_KEY_PRODUCTION : TRANSAK_API_KEY_STAGING;
  const subdomain = IS_PRODUCTION_ENV ? 'global' : 'staging-global';
  const screenTitle = 'Buy Stacks';

  return `https://${subdomain}.transak.com?apiKey=${apiKey}&cryptoCurrencyCode=STX&exchangeScreenTitle=${encodeURI(
    screenTitle
  )}&defaultPaymentMethod=credit_debit_card&walletAddress=${address}`;
}

function makeFiatProviderFaqUrl(address: string, provider: string) {
  return `https://hiro.so/wallet-faq/how-do-i-buy-stx-from-an-exchange?provider=${provider}&address=${address}`;
}

export function getProviderUrl(address: string, providerKey: string, providerName: string) {
  switch (providerKey) {
    case ActiveFiatProviders.MoonPay:
      return makeMoonPayUrl(address);
    case ActiveFiatProviders.Okcoin:
      return makeOkcoinUrl(address);
    case ActiveFiatProviders.Transak:
      return makeTransakUrl(address);
    default:
      return makeFiatProviderFaqUrl(address, providerName);
  }
}
