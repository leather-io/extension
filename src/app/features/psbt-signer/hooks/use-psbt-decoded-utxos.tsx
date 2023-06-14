import * as btc from '@scure/btc-signer';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';
import { BitcoinTransactionVectorOutput } from '@shared/models/transactions/bitcoin-transaction.model';
import { isDefined } from '@shared/utils';

import {
  OrdApiInscriptionTxOutput,
  useOrdinalsAwareUtxoQueries,
} from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import { useGetBitcoinTransactionQueries } from '@app/query/bitcoin/transaction/transaction.query';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export interface PsbtDecodedUtxosMainnet {
  network: WalletDefaultNetworkConfigurationIds.mainnet;
  utxos: (TaprootUtxo & OrdApiInscriptionTxOutput)[];
}

export interface PsbtDecodedUtxosTestnet {
  network: WalletDefaultNetworkConfigurationIds.testnet;
  utxos: BitcoinTransactionVectorOutput[];
}

export function usePsbtDecodedUtxos(
  unsignedInputs: btc.TransactionInputRequired[]
): PsbtDecodedUtxosMainnet | PsbtDecodedUtxosTestnet {
  const network = useCurrentNetwork();
  const unsignedUtxos = useGetBitcoinTransactionQueries(unsignedInputs)
    .map(query => query.data)
    .filter(isDefined)
    .map((input, i) => input.vout[unsignedInputs[i].index]);
  // Mainnet only enabled query
  const unsignedUtxosWithInscriptions = useOrdinalsAwareUtxoQueries(unsignedInputs)
    .map(query => query.data)
    .filter(isDefined);

  return network.chain.bitcoin.network === 'mainnet' && unsignedUtxosWithInscriptions.length
    ? {
        network: WalletDefaultNetworkConfigurationIds.mainnet,
        utxos: unsignedUtxosWithInscriptions,
      }
    : { network: WalletDefaultNetworkConfigurationIds.testnet, utxos: unsignedUtxos };
}
