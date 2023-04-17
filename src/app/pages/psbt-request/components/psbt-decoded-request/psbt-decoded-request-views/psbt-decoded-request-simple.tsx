import { InputsOutputPair } from '@app/pages/psbt-request/hooks/match-inputs-and-outputs';

import { PsbtInputOutputPair } from '../psbt-input-output-pair/psbt-input-output-pair';
import { PsbtInputOutputPlaceholder } from '../psbt-input-output-pair/psbt-input-output-placeholder';

interface PsbtDecodedRequestSimpleProps {
  bitcoinAddressNativeSegwit: string;
  bitcoinAddressTaproot: string;
  inputOutputPairs: InputsOutputPair[];
  showPlaceholder: boolean;
}
export function PsbtDecodedRequestSimple({
  bitcoinAddressNativeSegwit,
  bitcoinAddressTaproot,
  inputOutputPairs,
  showPlaceholder,
}: PsbtDecodedRequestSimpleProps) {
  if (showPlaceholder) return <PsbtInputOutputPlaceholder />;

  return (
    <>
      {inputOutputPairs.map((pair, i) => {
        return (
          <PsbtInputOutputPair
            addressNativeSegwit={bitcoinAddressNativeSegwit}
            addressTaproot={bitcoinAddressTaproot}
            inputOutputPair={pair}
            isFirstPair={i === 0}
            isLastPair={i === inputOutputPairs.length - 1}
            key={i}
          />
        );
      })}
    </>
  );
}
