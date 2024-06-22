import { hexToBytes } from '@stacks/common';
import { BytesReader, PostCondition, deserializePostCondition } from '@stacks/transactions';
import { toUnicode } from 'punycode';

import { KEBAB_REGEX } from '@leather.io/constants';
import {
  type BitcoinChainConfig,
  type BitcoinNetworkModes,
  HIRO_API_BASE_URL_NAKAMOTO_TESTNET,
} from '@leather.io/models';
import type { Sip10CryptoAssetFilter } from '@leather.io/query';

import { HIRO_EXPLORER_URL } from '@shared/constants';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { type IManageTokens, useAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';

function kebabCase(str: string) {
  return str.replace(KEBAB_REGEX, match => '-' + match.toLowerCase());
}

interface MakeBitcoinTxExplorerLinkArgs {
  txid: string;
  bitcoin: BitcoinChainConfig;
}

export type AssetFilter = 'all' | 'enabled' | 'disabled';

export const defaultEnabledTokens = new Set([
  'bitcoin',
  'stacks',
  'DOG•GO•TO•THE•MOON',
  'SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token::welshcorgicoin',
  'SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token::leo',
  'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-token::miamicoin',
  'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc::aeusdc',
  'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-abtc::bridged-btc',
  'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt::bridged-usdt',
  'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex::alex',
  'SM26NBC8SFHNW4P1Y4DFH27974P56WN86C92HPEHH.token-lqstx::lqstx',
  'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token::velar',
  'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token::ststx',
  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token::diko',
]);

interface MakeStacksTxExplorerLinkArgs {
  mode: BitcoinNetworkModes;
  searchParams?: URLSearchParams;
  txid: string;
  isNakamoto?: boolean;
}

export function makeStacksTxExplorerLink({
  mode,
  searchParams = new URLSearchParams(),
  txid,
  isNakamoto = false,
}: MakeStacksTxExplorerLinkArgs) {
  searchParams.append('chain', mode);
  if (isNakamoto) {
    searchParams.append('api', HIRO_API_BASE_URL_NAKAMOTO_TESTNET);
  }
  return `${HIRO_EXPLORER_URL}/txid/${txid}?${searchParams.toString()}`;
}

interface MakeStacksAddressExplorerLinkArgs {
  mode: BitcoinNetworkModes;
  searchParams?: URLSearchParams;
  address: string;
  isNakamoto?: boolean;
}

export function makeStacksAddressExplorerLink({
  mode,
  searchParams = new URLSearchParams(),
  address,
  isNakamoto = false,
}: MakeStacksAddressExplorerLinkArgs) {
  searchParams.append('chain', mode);
  if (isNakamoto) {
    searchParams.append('api', HIRO_API_BASE_URL_NAKAMOTO_TESTNET);
  }
  return `${HIRO_EXPLORER_URL}/address/${address}?${searchParams.toString()}`;
}

export function makeBitcoinTxExplorerLink({
  txid,
  bitcoin: { bitcoinUrl, bitcoinNetwork },
}: MakeBitcoinTxExplorerLinkArgs) {
  switch (bitcoinNetwork) {
    case 'mainnet':
    case 'testnet':
      return `https://mempool.space/${
        bitcoinNetwork !== 'mainnet' ? bitcoinNetwork + '/' : ''
      }tx/${txid}`;
    case 'regtest':
      return `${bitcoinUrl}/tx/${txid}`;
    default:
      return '';
  }
}

export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + '…';
}

function getLetters(string: string, offset = 1) {
  return string.slice(0, offset);
}

export function getTicker(value: string) {
  let name = kebabCase(value);
  if (name.includes('-')) {
    const words = name.split('-');
    if (words.length >= 3) {
      name = `${getLetters(words[0])}${getLetters(words[1])}${getLetters(words[2])}`;
    } else {
      name = `${getLetters(words[0])}${getLetters(words[1], 2)}`;
    }
  } else if (name.length >= 3) {
    name = `${getLetters(name, 3)}`;
  }
  return name.toUpperCase();
}

export function postConditionFromString(postCondition: string): PostCondition {
  const reader = new BytesReader(hexToBytes(postCondition));
  return deserializePostCondition(reader);
}

function isUtf8(buf?: Buffer | Uint8Array): boolean {
  if (!buf) {
    return false;
  }
  let i = 0;
  const len = buf.length;
  while (i < len) {
    // UTF8-1 = %x00-7F
    if (buf[i] <= 0x7f) {
      i++;
      continue;
    }
    // UTF8-2 = %xC2-DF UTF8-tail
    if (buf[i] >= 0xc2 && buf[i] <= 0xdf) {
      // if(buf[i + 1] >= 0x80 && buf[i + 1] <= 0xBF) {
      if (buf[i + 1] >> 6 === 2) {
        i += 2;

        continue;
      } else {
        return false;
      }
    }
    // UTF8-3 = %xE0 %xA0-BF UTF8-tail
    // UTF8-3 = %xED %x80-9F UTF8-tail
    if (
      ((buf[i] === 0xe0 && buf[i + 1] >= 0xa0 && buf[i + 1] <= 0xbf) ||
        (buf[i] === 0xed && buf[i + 1] >= 0x80 && buf[i + 1] <= 0x9f)) &&
      buf[i + 2] >> 6 === 2
    ) {
      i += 3;
      continue;
    }
    // UTF8-3 = %xE1-EC 2( UTF8-tail )
    // UTF8-3 = %xEE-EF 2( UTF8-tail )
    if (
      ((buf[i] >= 0xe1 && buf[i] <= 0xec) || (buf[i] >= 0xee && buf[i] <= 0xef)) &&
      buf[i + 1] >> 6 === 2 &&
      buf[i + 2] >> 6 === 2
    ) {
      i += 3;

      continue;
    }
    // UTF8-4 = %xF0 %x90-BF 2( UTF8-tail )
    //          %xF1-F3 3( UTF8-tail )
    //          %xF4 %x80-8F 2( UTF8-tail )
    if (
      ((buf[i] === 0xf0 && buf[i + 1] >= 0x90 && buf[i + 1] <= 0xbf) ||
        (buf[i] >= 0xf1 && buf[i] <= 0xf3 && buf[i + 1] >> 6 === 2) ||
        (buf[i] === 0xf4 && buf[i + 1] >= 0x80 && buf[i + 1] <= 0x8f)) &&
      buf[i + 2] >> 6 === 2 &&
      buf[i + 3] >> 6 === 2
    ) {
      i += 4;
      continue;
    }
    return false;
  }
  return true;
}

export const abbreviateNumber = (n: number) => {
  if (n < 1e3) return n.toString();
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(2) + 'K';
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(2) + 'M';
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(2) + 'B';
  if (n >= 1e12) return +(n / 1e12).toFixed(2) + 'T';
  return n.toString();
};

function isHex(hex: string): boolean {
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(hex);
}

function cleanHex(hexWithMaybePrefix: string): string {
  if (hexWithMaybePrefix !== 'string') return hexWithMaybePrefix;
  return hexWithMaybePrefix.startsWith('0x')
    ? hexWithMaybePrefix.replace('0x', '')
    : hexWithMaybePrefix;
}

export function hexToBuff(hex: string): Buffer {
  return Buffer.from(cleanHex(hex), 'hex');
}

export function hexToHumanReadable(hex: string) {
  if (!isHex(hex)) return hex;
  const buff = hexToBuff(hex);
  if (isUtf8(buff)) return buff.toString('utf8');
  return `0x${hex}`;
}

export const slugify = (...args: (string | number)[]): string => {
  const value = args.join(' ');

  return value
    .normalize('NFD') // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-'); // separator
};

export function getUrlHostname(url: string) {
  return new URL(url).hostname;
}

function getUrlPort(url: string) {
  return new URL(url).port;
}

export function addPortSuffix(url: string) {
  const port = getUrlPort(url);
  return port ? `:${port}` : '';
}

export function with0x(value: string): string {
  return !value.startsWith('0x') ? `0x${value}` : value;
}

export function getPrincipalFromContractId(identifier: string) {
  return identifier.split('::')[0];
}

export function formatContractId(address: string, name: string) {
  return `${address}.${name}`;
}

export function doesBrowserSupportWebUsbApi() {
  return Boolean((navigator as any).usb);
}

function isFullPage() {
  return document.location.pathname.startsWith('/index.html');
}

const pageMode = isFullPage() ? 'full' : 'popup';

type PageMode = 'popup' | 'full';

type WhenPageModeMap<T> = Record<PageMode, T>;

// don't use whenPageMode for styling - use panda responsive object
export function whenPageMode<T>(pageModeMap: WhenPageModeMap<T>) {
  return pageModeMap[pageMode];
}

export function isPopupMode() {
  return pageMode === 'popup';
}

export const parseIfValidPunycode = (s: string) => {
  try {
    return toUnicode(s);
  } catch {
    return s;
  }
};

export function capitalize(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

interface LinearInterpolation {
  start: number;
  end: number;
  t: number;
}

// Linear Interpolation
export function linearInterpolation({ start, end, t }: LinearInterpolation) {
  return (1 - t) * start + t * end;
}

export function removeTrailingNullCharacters(s: string) {
  return s.replace(/\0*$/g, '');
}

export function removeMinusSign(value: string) {
  return value.replace('-', '');
}

export function filterTokens<T>({
  tokens,
  filter = 'all',
  getTokenIdentifier,
}: {
  tokens: T[];
  filter: AssetFilter | Sip10CryptoAssetFilter;
  getTokenIdentifier: (token: T) => string;
}): T[] {
  const accountIndex = useCurrentAccountIndex();
  const allTokens = useAllTokens();

  if (filter === 'all') return tokens;

  return tokens.filter(token => {
    const tokenIdentifier = getTokenIdentifier(token);
    switch (filter) {
      case 'supported':
      case 'enabled':
        return isTokenEnabled({ tokenIdentifier, allTokens, accountIndex });
      case 'disabled':
      case 'unsupported':
        return !isTokenEnabled({ tokenIdentifier, allTokens, accountIndex });
    }
  });
}

export function isTokenEnabled({
  allTokens,
  accountIndex,
  tokenIdentifier,
}: {
  allTokens: IManageTokens[];
  accountIndex: number;
  tokenIdentifier: string;
}) {
  const tokenSetByUser = allTokens.find(
    t => t.accountIndex === accountIndex && t.id === tokenIdentifier
  );
  const isEnabledByDefault = defaultEnabledTokens.has(tokenIdentifier);
  return tokenSetByUser?.enabled ?? isEnabledByDefault;
}
