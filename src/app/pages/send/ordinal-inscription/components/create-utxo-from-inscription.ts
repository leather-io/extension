import { Inscription } from '@shared/models/inscription.model';

import { TaprootUtxo } from '@app/query/bitcoin/bitcoin-client';

export function createUtxoFromInscription(inscription: Inscription): TaprootUtxo {
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
    addressIndex,
  };
}
