import { BitcoinNetworkModes } from '@shared/constants';

// See this PR https://github.com/paulmillr/@scure/btc-signer/pull/15
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

const bitcoinRegtest: BitcoinNetwork = {
  bech32: 'bcrt',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

const bitcoinSignet: BitcoinNetwork = {
  bech32: 'sb',
  pubKeyHash: 0x3f,
  scriptHash: 0x7f,
  wif: 0x80,
};

const bitcoinNetworks: Record<BitcoinNetworkModes, BitcoinNetwork> = {
  mainnet: bitcoinMainnet,
  testnet: bitcoinTestnet,
  regtest: bitcoinRegtest,
  signet: bitcoinSignet,
};

export function getBtcSignerLibNetworkConfigByMode(network: BitcoinNetworkModes) {
  return bitcoinNetworks[network];
}
