import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import * as btc from '@scure/btc-signer';

import { RouteUrls } from '@shared/route-urls';
import { AllowedSighashTypes } from '@shared/rpc/methods/sign-psbt';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { SignPsbtArgs } from '@app/common/psbt/requests';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { PsbtInputsAndOutputs } from './components/psbt-inputs-and-outputs/psbt-inputs-and-outputs';
import { PsbtInputsOutputsTotals } from './components/psbt-inputs-outputs-totals/psbt-inputs-outputs-totals';
import { PsbtRequestActions } from './components/psbt-request-actions';
import { PsbtRequestDetailsHeader } from './components/psbt-request-details-header';
import { PsbtRequestDetailsLayout } from './components/psbt-request-details.layout';
import { PsbtRequestFee } from './components/psbt-request-fee';
import { PsbtRequestHeader } from './components/psbt-request-header';
import { PsbtRequestRaw } from './components/psbt-request-raw';
import { PsbtRequestSighashWarningLabel } from './components/psbt-request-sighash-warning-label';
import { PsbtSignerLayout } from './components/psbt-signer.layout';
import { useParsedPsbt } from './hooks/use-parsed-psbt';
import { usePsbtSigner } from './hooks/use-psbt-signer';
import { PsbtSignerContext, PsbtSignerProvider } from './psbt-signer.context';

function getPsbtTxInputs(psbtTx: btc.Transaction) {
  const inputsLength = psbtTx.inputsLength;
  const inputs: btc.TransactionInput[] = [];
  if (inputsLength === 0) return inputs;
  for (let i = 0; i < inputsLength; i++) {
    inputs.push(psbtTx.getInput(i));
  }
  return inputs;
}

function getPsbtTxOutputs(psbtTx: btc.Transaction) {
  const outputsLength = psbtTx.outputsLength;
  const outputs: btc.TransactionOutput[] = [];
  if (outputsLength === 0) return outputs;
  for (let i = 0; i < outputsLength; i++) {
    outputs.push(psbtTx.getOutput(i));
  }
  return outputs;
}

interface PsbtSignerProps {
  allowedSighash?: AllowedSighashTypes[];
  indexesToSign?: number[];
  isBroadcasting?: boolean;
  name?: string;
  origin: string;
  onCancel(): void;
  onSignPsbt({ addressNativeSegwitTotal, addressTaprootTotal, fee, inputs }: SignPsbtArgs): void;
  psbtHex: string;
}
export function PsbtSigner(props: PsbtSignerProps) {
  const {
    allowedSighash,
    indexesToSign,
    isBroadcasting,
    name,
    origin,
    onCancel,
    onSignPsbt,
    psbtHex,
  } = props;
  const navigate = useNavigate();
  const { address: addressNativeSegwit } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { address: addressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const { getRawPsbt, getPsbtAsTransaction } = usePsbtSigner();

  useRouteHeader(<PopupHeader displayAddresssBalanceOf="all" />);

  useOnOriginTabClose(() => window.close());

  const psbtRaw = useMemo(() => {
    try {
      return getRawPsbt(psbtHex);
    } catch (e) {
      navigate(RouteUrls.RequestError, {
        state: { message: e instanceof Error ? e.message : '', title: 'Failed request' },
      });
      return;
    }
  }, [getRawPsbt, navigate, psbtHex]);

  const psbtTx = useMemo(() => getPsbtAsTransaction(psbtHex), [getPsbtAsTransaction, psbtHex]);
  const psbtTxInputs = useMemo(() => getPsbtTxInputs(psbtTx), [psbtTx]);
  const psbtTxOutputs = useMemo(() => getPsbtTxOutputs(psbtTx), [psbtTx]);

  const {
    accountInscriptionsBeingTransferred,
    accountInscriptionsBeingReceived,
    addressNativeSegwitTotal,
    addressTaprootTotal,
    fee,
    isPsbtMutable,
    psbtInputs,
    psbtOutputs,
    shouldDefaultToAdvancedView,
  } = useParsedPsbt({
    allowedSighash,
    inputs: psbtTxInputs,
    indexesToSign,
    outputs: psbtTxOutputs,
  });

  const psbtSignerContext: PsbtSignerContext = {
    accountInscriptionsBeingTransferred,
    accountInscriptionsBeingReceived,
    addressNativeSegwit,
    addressTaproot,
    addressNativeSegwitTotal,
    addressTaprootTotal,
    fee,
    isPsbtMutable,
    psbtInputs,
    psbtOutputs,
    shouldDefaultToAdvancedView,
  };

  if (shouldDefaultToAdvancedView && psbtRaw) return <PsbtRequestRaw psbt={psbtRaw} />;

  return (
    <PsbtSignerProvider value={psbtSignerContext}>
      <PsbtSignerLayout>
        <PsbtRequestHeader name={name} origin={origin} />
        <PsbtRequestDetailsLayout>
          {isPsbtMutable ? <PsbtRequestSighashWarningLabel /> : null}
          <PsbtRequestDetailsHeader />
          <PsbtInputsOutputsTotals />
          <PsbtInputsAndOutputs />
          {psbtRaw ? <PsbtRequestRaw psbt={psbtRaw} /> : null}
          <PsbtRequestFee fee={fee} />
        </PsbtRequestDetailsLayout>
      </PsbtSignerLayout>
      <PsbtRequestActions
        isLoading={isBroadcasting}
        onCancel={onCancel}
        onSignPsbt={() =>
          onSignPsbt({ addressNativeSegwitTotal, addressTaprootTotal, fee, inputs: psbtTxInputs })
        }
      />
    </PsbtSignerProvider>
  );
}
