import * as btc from '@scure/btc-signer';
import { Stack, color } from '@stacks/ui';

import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentBtcTaprootAccountAddressIndexZeroPayment } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { PsbtInput, usePsbtDecodedRequest } from '../../hooks/use-psbt-decoded-request';
import { PsbtDecodedRequestAdvanced } from './psbt-decoded-request-views/psbt-decoded-request-advanced';
import { PsbtDecodedRequestSimple } from './psbt-decoded-request-views/psbt-decoded-request-simple';
import { PsbtDecodedRequestViewToggle } from './psbt-decoded-request-views/psbt-decoded-request-view-toggle';

interface PsbtDecodedRequestProps {
  psbt: any;
}
export function PsbtDecodedRequest({ psbt }: PsbtDecodedRequestProps) {
  const bitcoinAddressNativeSegwit = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const { address: bitcoinAddressTaproot } = useCurrentBtcTaprootAccountAddressIndexZeroPayment();
  const psbtInputs: PsbtInput[] = psbt.inputs;
  const unsignedInputs: btc.TransactionInputRequired[] = psbt.global.unsignedTx.inputs;
  const unsignedOutputs: btc.TransactionOutputRequired[] = psbt.global.unsignedTx.outputs;

  const {
    inputOutputPairs,
    onSetShowAdvancedView,
    shouldDefaultToAdvancedView,
    shouldShowPlaceholder,
    showAdvancedView,
  } = usePsbtDecodedRequest({
    psbtInputs,
    unsignedInputs,
    unsignedOutputs,
  });

  return (
    <Stack
      backgroundColor={color('border')}
      border="4px solid"
      borderColor={color('border')}
      borderRadius="20px"
      paddingBottom="tight"
      spacing="extra-tight"
      width="100%"
    >
      {showAdvancedView || shouldDefaultToAdvancedView ? (
        <PsbtDecodedRequestAdvanced psbt={psbt} />
      ) : (
        <PsbtDecodedRequestSimple
          bitcoinAddressNativeSegwit={bitcoinAddressNativeSegwit}
          bitcoinAddressTaproot={bitcoinAddressTaproot}
          inputOutputPairs={inputOutputPairs}
          showPlaceholder={shouldShowPlaceholder}
        />
      )}
      <PsbtDecodedRequestViewToggle
        onSetShowAdvancedView={onSetShowAdvancedView}
        shouldDefaultToAdvancedView={shouldDefaultToAdvancedView}
        showAdvancedView={showAdvancedView}
      />
    </Stack>
  );
}
