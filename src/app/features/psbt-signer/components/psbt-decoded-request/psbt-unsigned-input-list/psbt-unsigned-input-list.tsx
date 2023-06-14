import * as btc from '@scure/btc-signer';
import { Box, Text } from '@stacks/ui';

import { isUndefined } from '@shared/utils';

import { useOrdinalsAwareUtxoQueries } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';

import { PsbtDecodedNodeLayout } from '../psbt-decoded-request-node/psbt-decoded-node.layout';
import { PsbtUnsignedInputItem } from './components/psbt-unsigned-input-item';

interface PsbtUnsignedInputListProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  inputs: btc.TransactionInputRequired[];
}
export function PsbtUnsignedInputList({
  addressNativeSegwit,
  addressTaproot,
  inputs,
}: PsbtUnsignedInputListProps) {
  const unsignedUtxos = useOrdinalsAwareUtxoQueries(inputs).map(query => query.data);

  return (
    <Box background="white" borderTopLeftRadius="16px" borderTopRightRadius="16px" p="loose">
      <Text fontWeight={500}>Inputs</Text>
      {unsignedUtxos.map(utxo => {
        if (isUndefined(utxo)) return <PsbtDecodedNodeLayout value="No input data found" />;

        return (
          <PsbtUnsignedInputItem
            addressNativeSegwit={addressNativeSegwit}
            addressTaproot={addressTaproot}
            key={utxo.transaction}
            utxo={utxo}
          />
        );
      })}
    </Box>
  );
}
