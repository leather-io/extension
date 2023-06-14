import {
  PsbtDecodedUtxosMainnet,
  PsbtDecodedUtxosTestnet,
} from '@app/features/psbt-signer/hooks/use-psbt-decoded-utxos';

import { PsbtDecodedNodeLayout } from '../psbt-decoded-request-node/psbt-decoded-node.layout';
import { PsbtUnsignedInputItem } from './components/psbt-unsigned-input-item';
import { PsbtUnsignedInputItemWithPossibleInscription } from './components/psbt-unsigned-input-item-with-possible-inscription';
import { PsbtUnsignedInputListLayout } from './components/psbt-unsigned-input-list.layout';

interface PsbtUnsignedInputListProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  inputs: PsbtDecodedUtxosMainnet | PsbtDecodedUtxosTestnet;
}
export function PsbtUnsignedInputList({
  addressNativeSegwit,
  addressTaproot,
  inputs,
}: PsbtUnsignedInputListProps) {
  if (!inputs.utxos.length)
    return (
      <PsbtUnsignedInputListLayout>
        <PsbtDecodedNodeLayout value="No inputs found" />
      </PsbtUnsignedInputListLayout>
    );

  switch (inputs.network) {
    case 'mainnet':
      return (
        <PsbtUnsignedInputListLayout>
          {inputs.utxos.map((utxo, i) => {
            return (
              <PsbtUnsignedInputItemWithPossibleInscription
                addressNativeSegwit={addressNativeSegwit}
                addressTaproot={addressTaproot}
                key={i}
                utxo={utxo}
              />
            );
          })}
        </PsbtUnsignedInputListLayout>
      );
    case 'testnet':
      return (
        <PsbtUnsignedInputListLayout>
          {inputs.utxos.map((utxo, i) => {
            return (
              <PsbtUnsignedInputItem
                addressNativeSegwit={addressNativeSegwit}
                addressTaproot={addressTaproot}
                key={i}
                utxo={utxo}
              />
            );
          })}
        </PsbtUnsignedInputListLayout>
      );
    default:
      return null;
  }
}
