import * as btc from '@scure/btc-signer';
import { Stack, color } from '@stacks/ui';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootAddressIndexZeroPayment } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { usePsbtDecodedRequest } from '../../hooks/use-psbt-decoded-request';
import { PsbtDecodedRequestAdvanced } from './psbt-decoded-request-views/psbt-decoded-request-advanced';
import { PsbtDecodedRequestSimple } from './psbt-decoded-request-views/psbt-decoded-request-simple';
import { PsbtDecodedRequestViewToggle } from './psbt-decoded-request-views/psbt-decoded-request-view-toggle';

interface PsbtDecodedRequestProps {
  psbt: any;
}
export function PsbtDecodedRequest({ psbt }: PsbtDecodedRequestProps) {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootAddressIndexZeroPayment();
  const unsignedInputs: btc.TransactionInputRequired[] = psbt.global.unsignedTx.inputs;
  const unsignedOutputs: btc.TransactionOutputRequired[] = psbt.global.unsignedTx.outputs;

  const {
    onSetShowAdvancedView,
    shouldDefaultToAdvancedView,
    shouldShowPlaceholder,
    showAdvancedView,
  } = usePsbtDecodedRequest({
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
          bitcoinAddressNativeSegwit={nativeSegwitSigner.address}
          bitcoinAddressTaproot={bitcoinAddressTaproot}
          inputs={unsignedInputs}
          outputs={unsignedOutputs}
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
