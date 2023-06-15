import * as btc from '@scure/btc-signer';

import { PsbtPlaceholderNode } from '../psbt-decoded-request-node/psbt-placeholder-node';
import { PsbtUnsignedInputList } from '../psbt-unsigned-input-list/psbt-unsigned-input-list';
import { PsbtUnsignedOutputList } from '../psbt-unsigned-output-list/psbt-unsigned-output-list';

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
  if (showPlaceholder) return <PsbtPlaceholderNode />;

  return (
    <>
      <PsbtUnsignedInputList
        addressNativeSegwit={bitcoinAddressNativeSegwit}
        addressTaproot={bitcoinAddressTaproot}
        inputs={inputs}
      />
      <PsbtUnsignedOutputList
        addressNativeSegwit={bitcoinAddressNativeSegwit}
        addressTaproot={bitcoinAddressTaproot}
        outputs={outputs}
      />
    </>
  );
}
