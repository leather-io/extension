import * as btc from '@scure/btc-signer';

import { PsbtDecodedNodeLayout } from '../psbt-decoded-request-node/psbt-decoded-node.layout';
import { PsbtUnsignedOutputItem } from './components/psbt-unsigned-output-item';
import { PsbtUnsignedOutputListLayout } from './components/psbt-unsigned-output-list.layout';

interface PsbtUnsignedOutputListProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  outputs: btc.TransactionOutputRequired[];
}
export function PsbtUnsignedOutputList({
  addressNativeSegwit,
  addressTaproot,
  outputs,
}: PsbtUnsignedOutputListProps) {
  if (!outputs.length)
    return (
      <PsbtUnsignedOutputListLayout>
        <PsbtDecodedNodeLayout value="No outputs found" />
      </PsbtUnsignedOutputListLayout>
    );

  return (
    <PsbtUnsignedOutputListLayout>
      {outputs.map((output, i) => {
        return (
          <PsbtUnsignedOutputItem
            addressNativeSegwit={addressNativeSegwit}
            addressTaproot={addressTaproot}
            key={i}
            output={output}
          />
        );
      })}
    </PsbtUnsignedOutputListLayout>
  );
}
