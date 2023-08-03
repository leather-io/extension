import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { convertInscriptionToSupportedInscriptionType } from './inscription.hooks';
import { useGetInscriptionByParamQuery } from './use-inscription-by-param.query';

export function useInscriptionByOutput(transaction: BitcoinTx) {
  const inputsLength = transaction.vin.length;
  const index = inputsLength === 1 ? 0 : inputsLength - 2;

  return useGetInscriptionByParamQuery(`output=${transaction.txid}:${index}`, {
    select(data) {
      const inscription = data.results[0];
      if (!inscription) return;
      return convertInscriptionToSupportedInscriptionType(inscription);
    },
  });
}
