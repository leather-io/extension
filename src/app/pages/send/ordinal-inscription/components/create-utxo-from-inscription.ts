import { BitcoinNetworkModes } from '@shared/constants';
import { getNativeSegwitAddressIndexDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';
import { Inscription } from '@shared/models/inscription.model';

import { UtxoWithDerivationPath } from '@app/query/bitcoin/bitcoin-client';

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
    txid: inscription.tx_id,
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
