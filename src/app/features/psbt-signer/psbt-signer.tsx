import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import * as btc from '@scure/btc-signer';

import { RouteUrls } from '@shared/route-urls';
import { AllowedSighashTypes } from '@shared/rpc/methods/sign-psbt';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

import { PsbtRequestActions } from './components/psbt-request-actions';
import { PsbtRequestDetails } from './components/psbt-request-details/psbt-request-details';
import { PsbtRequestHeader } from './components/psbt-request-header';
import { PsbtSignerLayout } from './components/psbt-signer.layout';
import { usePsbtSigner } from './hooks/use-psbt-signer';

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
  name?: string;
  origin: string;
  onCancel(): void;
  onSignPsbt(inputs: btc.TransactionInput[]): void;
  psbtHex: string;
}
export function PsbtSigner(props: PsbtSignerProps) {
  const { allowedSighash, indexesToSign, name, origin, onCancel, onSignPsbt, psbtHex } = props;
  const navigate = useNavigate();
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

  return (
    <>
      <PsbtSignerLayout>
        <PsbtRequestHeader name={name} origin={origin} />
        <PsbtRequestDetails
          allowedSighash={allowedSighash}
          indexesToSign={indexesToSign}
          psbtRaw={psbtRaw}
          psbtTxInputs={psbtTxInputs}
          psbtTxOutputs={psbtTxOutputs}
        />
      </PsbtSignerLayout>
      <PsbtRequestActions
        isLoading={false}
        onCancel={onCancel}
        onSignPsbt={() => onSignPsbt(psbtTxInputs)}
      />
    </>
  );
}
