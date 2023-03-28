import { InscriptionLoader } from '@app/components/inscription-loader';
import { useTaprootAccountUtxosQuery } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

import { Inscription } from './inscription';

export function Ordinals() {
  const { data: utxos = [] } = useTaprootAccountUtxosQuery();

  return (
    <>
      {utxos.map(utxo => (
        <InscriptionLoader key={utxo.txid} utxo={utxo}>
          {path => <Inscription path={path} utxo={utxo} />}
        </InscriptionLoader>
      ))}
    </>
  );
}
