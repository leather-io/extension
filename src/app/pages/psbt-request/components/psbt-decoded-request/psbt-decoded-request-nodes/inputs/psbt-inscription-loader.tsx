import * as btc from '@scure/btc-signer';

import { isEmpty } from '@shared/utils';

import {
  OrdApiInscriptionTxOutput,
  useOrdinalsAwareUtxoQuery,
} from '@app/query/bitcoin/ordinals/use-ordinals-aware-utxo.query';

interface PsbtInscriptionLoaderProps {
  utxo: btc.TransactionInputRequired;
  children(txOutput: OrdApiInscriptionTxOutput): JSX.Element | null;
}
export function PsbtInscriptionLoader({ utxo, children }: PsbtInscriptionLoaderProps) {
  const { data: txOutput } = useOrdinalsAwareUtxoQuery(utxo);
  if (!txOutput || isEmpty(txOutput)) return null;
  return children(txOutput);
}
