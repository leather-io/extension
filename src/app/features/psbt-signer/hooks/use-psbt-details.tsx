import { useCallback, useMemo } from 'react';

import type { TransactionInput, TransactionOutput } from '@scure/btc-signer/psbt';

import { createMoney, subtractMoney } from '@leather.io/utils';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useParsedInputs } from './use-parsed-inputs';
import { useParsedOutputs } from './use-parsed-outputs';
import { usePsbtInscriptions } from './use-psbt-inscriptions';
import { usePsbtTotals } from './use-psbt-totals';

interface UsePsbtDetailsArgs {
  inputs: TransactionInput[];
  indexesToSign?: number[];
  outputs: TransactionOutput[];
}
export function usePsbtDetails({ inputs, indexesToSign, outputs }: UsePsbtDetailsArgs) {
  const network = useCurrentNetwork();
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const { isPsbtMutable, parsedInputs } = useParsedInputs({
    inputs,
    indexesToSign,
  });
  const parsedOutputs = useParsedOutputs({ isPsbtMutable, outputs, network });

  const {
    inputsTotalNativeSegwit,
    inputsTotalTaproot,
    outputsTotalNativeSegwit,
    outputsTotalTaproot,
    psbtInputsTotal,
    psbtOutputsTotal,
  } = usePsbtTotals({
    bitcoinAddressNativeSegwit,
    bitcoinAddressTaproot,
    parsedInputs,
    parsedOutputs,
  });

  const { accountInscriptionsBeingTransferred, accountInscriptionsBeingReceived } =
    usePsbtInscriptions(parsedInputs, parsedOutputs);

  const defaultToAdvancedView = useCallback(() => {
    const noInputs = !inputs.length;
    const noOutputs = !outputs.length;
    return noInputs || noOutputs;
  }, [inputs.length, outputs.length]);

  const fee = useMemo(() => {
    if (psbtInputsTotal.amount.isGreaterThan(psbtOutputsTotal.amount))
      return subtractMoney(psbtInputsTotal, psbtOutputsTotal);
    return createMoney(0, 'BTC');
  }, [psbtInputsTotal, psbtOutputsTotal]);

  return {
    accountInscriptionsBeingTransferred,
    accountInscriptionsBeingReceived,
    addressNativeSegwitTotal: subtractMoney(inputsTotalNativeSegwit, outputsTotalNativeSegwit),
    addressTaprootTotal: subtractMoney(inputsTotalTaproot, outputsTotalTaproot),
    fee,
    isPsbtMutable,
    psbtInputs: parsedInputs,
    psbtOutputs: parsedOutputs,
    shouldDefaultToAdvancedView: defaultToAdvancedView(),
  };
}
