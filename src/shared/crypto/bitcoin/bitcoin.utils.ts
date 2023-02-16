import { NetworkModes } from '@shared/constants';

const coinTypeMap: Record<NetworkModes, 0 | 1> = {
  mainnet: 0,
  testnet: 1,
};

export function getBitcoinCoinTypeIndexByNetwork(network: NetworkModes) {
  return coinTypeMap[network];
}
