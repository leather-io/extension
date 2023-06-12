import * as btc from '@scure/btc-signer';

import { PsbtUnsignedInputList } from '../psbt-decoded-request-node/psbt-unsigned-input-list/psbt-unsigned-input-list';
import { PsbtUnsignedOutputList } from '../psbt-decoded-request-node/psbt-unsigned-output-list/psbt-unsigned-output-list';

interface PsbtDecodedRequestSimpleProps {
  bitcoinAddressNativeSegwit: string;
  bitcoinAddressTaproot: string;
  inputs: btc.TransactionInputRequired[];
  outputs: btc.TransactionOutputRequired[];
  showPlaceholder: boolean;
}
export function PsbtDecodedRequestSimple({
  bitcoinAddressNativeSegwit,
  bitcoinAddressTaproot,
  inputs,
  outputs,
  showPlaceholder,
}: PsbtDecodedRequestSimpleProps) {
  return (
    <>
      <PsbtUnsignedInputList
        addressNativeSegwit={bitcoinAddressNativeSegwit}
        addressTaproot={bitcoinAddressTaproot}
        inputs={inputs}
        showPlaceholder={showPlaceholder}
      />
      <PsbtUnsignedOutputList
        addressNativeSegwit={bitcoinAddressNativeSegwit}
        addressTaproot={bitcoinAddressTaproot}
        outputs={outputs}
        showPlaceholder={showPlaceholder}
      />
    </>
  );
}
