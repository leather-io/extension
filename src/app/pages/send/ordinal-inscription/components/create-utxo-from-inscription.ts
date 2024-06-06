import { getNativeSegwitAddressIndexDerivationPath } from '@leather-wallet/bitcoin';
import type { Inscription } from '@leather-wallet/models';
import type { UtxoWithDerivationPath } from '@leather-wallet/query';

import { BitcoinNetworkModes } from '@shared/constants';

interface CreateUtxoFromInscriptionArgs {
  inscription: Inscription;
  network: BitcoinNetworkModes;
  accountIndex: number;
  inscriptionAddressIdx: number;
}
export function createUtxoFromInscription({
  inscription,
  network,
  accountIndex,
  inscriptionAddressIdx,
}: CreateUtxoFromInscriptionArgs): UtxoWithDerivationPath {
  const { genesisBlockHash, genesisTimestamp, genesisBlockHeight, value } = inscription;
  return {
    txid: inscription.txid,
    vout: Number(inscription.output.split(':')[1]),
    status: {
      confirmed: true,
      block_height: genesisBlockHeight,
      block_hash: genesisBlockHash,
      block_time: genesisTimestamp,
    },
    value: Number(value),
    derivationPath: getNativeSegwitAddressIndexDerivationPath(
      network,
      accountIndex,
      inscriptionAddressIdx
    ),
  };
}
