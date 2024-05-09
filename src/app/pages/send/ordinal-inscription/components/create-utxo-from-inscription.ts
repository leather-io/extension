import type { InscriptionResponse, UtxoWithDerivationPath } from '@leather-wallet/query';

import { BitcoinNetworkModes } from '@shared/constants';
import { getNativeSegwitAddressIndexDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

interface CreateUtxoFromInscriptionArgs {
  inscriptionResponse: InscriptionResponse;
  network: BitcoinNetworkModes;
  accountIndex: number;
}

export function createUtxoFromInscription({
  inscriptionResponse,
  network,
  accountIndex,
}: CreateUtxoFromInscriptionArgs): UtxoWithDerivationPath {
  const { genesis_block_hash, genesis_timestamp, genesis_block_height, value, addressIndex } =
    inscriptionResponse;

  return {
    txid: inscriptionResponse.tx_id,
    vout: Number(inscriptionResponse.output.split(':')[1]),
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
