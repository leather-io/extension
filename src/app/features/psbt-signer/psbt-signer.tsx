import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PsbtSelectors } from '@tests/selectors/requests.selectors';

import { getPsbtTxInputs, getPsbtTxOutputs } from '@leather.io/bitcoin';
import { Button } from '@leather.io/ui';
import { isError } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { SignPsbtArgs } from '@app/common/psbt/requests';
import { ButtonRow, Card, CardContent, CardFooter } from '@app/components/layout';
import { PopupHeader } from '@app/features/container/headers/popup.header';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import * as Psbt from './components';
import { usePsbtDetails } from './hooks/use-psbt-details';
import { usePsbtSigner } from './hooks/use-psbt-signer';
import { PsbtSignerContext, PsbtSignerProvider } from './psbt-signer.context';

interface PsbtSignerProps {
  indexesToSign?: number[];
  isBroadcasting?: boolean;
  name?: string;
  origin: string;
  onCancel(): void;
  onSignPsbt({ addressNativeSegwitTotal, addressTaprootTotal, fee, inputs }: SignPsbtArgs): void;
  psbtHex: string;
}
export function PsbtSigner(props: PsbtSignerProps) {
  const { indexesToSign, isBroadcasting, name, origin, onCancel, onSignPsbt, psbtHex } = props;
  const navigate = useNavigate();
  const { address: addressNativeSegwit } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { address: addressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const { getRawPsbt, getPsbtAsTransaction } = usePsbtSigner();

  useOnOriginTabClose(() => closeWindow());

  const psbtRaw = useMemo(() => {
    try {
      return getRawPsbt(psbtHex);
    } catch (e) {
      navigate(RouteUrls.RequestError, {
        state: { message: isError(e) ? e.message : '', title: 'Failed request' },
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
  } = usePsbtDetails({
    inputs: psbtTxInputs,
    indexesToSign,
    outputs: psbtTxOutputs,
  });

  useBreakOnNonCompliantEntity(psbtOutputs.map(output => output.address));

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

  if (shouldDefaultToAdvancedView && psbtRaw) return <Psbt.PsbtRequestRaw psbt={psbtRaw} />;

  // need to also fix this issue with it scrolling too much
  //https://github.com/leather-io/issues/issues/235
  // thats already broken for ages.
  // could be better to not use a card here?
  // OR maybe add a different footer?

  return (
    <PsbtSignerProvider value={psbtSignerContext}>
      <PopupHeader showSwitchAccount balance="all" />
      <Card
        height="100%" // maybe give this to all cards?
        // has
        footer={
          // can I move borderTop to the button row?
          // then I can move CardFooter into Card
          // I can't move border top there BUT this is the only place we add that footer border
          // so now is a good time to try what Fab really wanted - only add the border if scrollable content
          // so try and do that on the CardContent
          // expands the scope of this a bit but will add a better solution

          // CardFooter only ever gets this border top and gets it added here
          // refactor thiis
          <CardFooter borderTop="default">
            <ButtonRow flexDirection="row">
              <Button flexGrow={1} onClick={onCancel} variant="outline">
                Cancel
              </Button>
              <Button
                flexGrow={1}
                aria-busy={isBroadcasting}
                onClick={() =>
                  onSignPsbt({
                    addressNativeSegwitTotal,
                    addressTaprootTotal,
                    fee,
                    inputs: psbtTxInputs,
                  })
                }
              >
                Confirm
              </Button>
            </ButtonRow>
          </CardFooter>
        }
      >
        <CardContent
          dataTestId={PsbtSelectors.PsbtSignerCard}
          maxHeight="80vh"
          marginBottom="128px"
        >
          <Psbt.PsbtRequestHeader name={name} origin={origin} />
          <Psbt.PsbtRequestDetailsLayout>
            {isPsbtMutable ? <Psbt.PsbtRequestSighashWarningLabel origin={origin} /> : null}
            <Psbt.PsbtRequestDetailsHeader />
            <Psbt.PsbtInputsOutputsTotals />
            <Psbt.PsbtInputsAndOutputs />
            {psbtRaw ? <Psbt.PsbtRequestRaw psbt={psbtRaw} /> : null}
            <Psbt.PsbtRequestFee fee={fee} />
          </Psbt.PsbtRequestDetailsLayout>
        </CardContent>
      </Card>
    </PsbtSignerProvider>
  );
}
