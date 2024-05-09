import type { Inscription } from '@leather-wallet/models';
import type { UtxoWithDerivationPath } from '@leather-wallet/query';

import { BitcoinNetworkModes } from '@shared/constants';
import { getNativeSegwitAddressIndexDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

interface CreateUtxoFromInscriptionArgs {
  inscription: Inscription;
  network: BitcoinNetworkModes;
  accountIndex: number;
}

export function createUtxoFromInscription({
  inscription,
  network,
  accountIndex,
}: CreateUtxoFromInscriptionArgs): UtxoWithDerivationPath {
  const { genesis_block_hash, genesis_timestamp, genesis_block_height, value, addressIndex } =
    inscription;

  return {
    txid: inscription.txid,
    vout: Number(inscription.output.split(':')[1]),
    status: {
      confirmed: true,
      block_height: genesis_block_height,
      block_hash: genesis_block_hash,
      block_time: genesis_timestamp,
    },
    value: Number(value),
    derivationPath: getNativeSegwitAddressIndexDerivationPath(network, accountIndex, addressIndex),
  };
}
