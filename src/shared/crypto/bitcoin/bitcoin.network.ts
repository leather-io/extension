import { NetworkModes } from '@shared/constants';

// See this PR https://github.com/paulmillr/micro-btc-signer/pull/15
// Atttempting to add these directly to the library
interface BitcoinNetwork {
  bech32: string;
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
}

const bitcoinMainnet: BitcoinNetwork = {
  bech32: 'bc',
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

const bitcoinTestnet: BitcoinNetwork = {
  bech32: 'tb',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

const bitcoinNetworks: Record<NetworkModes, BitcoinNetwork> = {
  mainnet: bitcoinMainnet,
  testnet: bitcoinTestnet,
};

export function getBtcSignerLibNetworkByMode(network: NetworkModes) {
  return bitcoinNetworks[network];
}
