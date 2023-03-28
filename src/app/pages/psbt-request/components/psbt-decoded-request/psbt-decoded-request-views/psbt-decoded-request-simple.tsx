import { useState } from 'react';

import * as btc from '@scure/btc-signer';

import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentBtcTaprootAccountAddressIndexZeroPayment } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { PsbtDecodedInputs } from '../psbt-decoded-request-nodes/inputs/psbt-decoded-inputs';
import { PsbtDecodedOutputs } from '../psbt-decoded-request-nodes/outputs/psbt-decoded-outputs';

export function PsbtDecodedRequestSimple(props: { psbt: any }) {
  const { psbt } = props;
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const bitcoinAddressNativeSegwit = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const { address: bitcoinAddressTaproot } = useCurrentBtcTaprootAccountAddressIndexZeroPayment();
  const inputs: btc.TransactionInputRequired[] = psbt.global.unsignedTx.inputs;
  const outputs: btc.TransactionOutputRequired[] = psbt.global.unsignedTx.outputs;

  return (
    <>
      <PsbtDecodedInputs
        addressNativeSegwit={bitcoinAddressNativeSegwit}
        inputs={inputs}
        showPlaceholder={showPlaceholder}
      />
      <PsbtDecodedOutputs
        addressNativeSegwit={bitcoinAddressNativeSegwit}
        addressTaproot={bitcoinAddressTaproot}
        onSetShowPlaceholder={() => setShowPlaceholder(true)}
        outputs={outputs}
        showPlaceholder={showPlaceholder}
      />
    </>
  );
}
