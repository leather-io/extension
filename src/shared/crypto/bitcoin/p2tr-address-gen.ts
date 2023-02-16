import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';

import { NetworkModes } from '@shared/constants';

import { getBtcSignerLibNetworkByMode } from './bitcoin.network';
import { getBitcoinCoinTypeIndexByNetwork } from './bitcoin.utils';

function getTaprootAccountDerivationPath(network: NetworkModes, accountIndex: number) {
  return `m/86'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function deriveTaprootAccountFromHdKey(keychain: HDKey, network: NetworkModes) {
  return (index: number) => keychain.derive(getTaprootAccountDerivationPath(network, index));
}

interface DeriveTaprootReceiveAddressIndexArgs {
  xpub: string;
  index: number;
  network: NetworkModes;
}
export function deriveTaprootReceiveAddressIndex({
  xpub,
  index,
  network,
}: DeriveTaprootReceiveAddressIndexArgs) {
  if (!xpub) return;
  const keychain = HDKey.fromExtendedKey(xpub);
  const zeroAddressIndex = keychain?.deriveChild(0).deriveChild(index);
  return btc.p2tr(
    undefined,
    [btc.p2tr_pk(zeroAddressIndex?.publicKey!)],
    getBtcSignerLibNetworkByMode(network)
  );
}
