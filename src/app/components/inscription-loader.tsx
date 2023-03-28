import { useOrdinalsAwareUtxoQuery } from '@app/query/bitcoin/ordinals/use-ordinals-aware-utxo.query';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

interface InscriptionLoaderProps {
  utxo: TaprootUtxo;
  children(path: string): JSX.Element;
}
export function InscriptionLoader({ utxo, children }: InscriptionLoaderProps) {
  const { data: inscriptionDetails } = useOrdinalsAwareUtxoQuery(utxo);
  if (!inscriptionDetails || !inscriptionDetails.inscriptions) return null;
  return children(inscriptionDetails.inscriptions);
}
