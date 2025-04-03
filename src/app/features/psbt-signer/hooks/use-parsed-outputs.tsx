import { useMemo } from 'react';

import type { TransactionOutput } from '@scure/btc-signer/psbt';

import { getAddressFromOutScript, getBtcSignerLibNetworkConfigByMode } from '@leather.io/bitcoin';
import type { NetworkConfiguration } from '@leather.io/models';
import { isDefined, isUndefined } from '@leather.io/utils';

import { logger } from '@shared/logger';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

export interface PsbtOutput {
  address: string | null;
  isMutable: boolean;
  toSign: boolean;
  value: number;
}

interface UseParsedOutputsArgs {
  isPsbtMutable: boolean;
  outputs: TransactionOutput[];
  network: NetworkConfiguration;
}
export function useParsedOutputs({ isPsbtMutable, outputs, network }: UseParsedOutputsArgs) {
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const bitcoinNetwork = getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.mode);

  return useMemo(
    () =>
      outputs
        .map(output => {
          if (isUndefined(output.script)) {
            logger.error('Output has no script');
            return;
          }
          const outputAddress = getAddressFromOutScript(output.script, bitcoinNetwork);

          const isCurrentAddress =
            outputAddress === bitcoinAddressNativeSegwit || outputAddress === bitcoinAddressTaproot;

          return {
            address: outputAddress,
            isMutable: isPsbtMutable,
            toSign: isCurrentAddress,
            value: Number(output.amount),
          };
        })
        .filter(isDefined),
    [bitcoinAddressNativeSegwit, bitcoinAddressTaproot, bitcoinNetwork, isPsbtMutable, outputs]
  );
}
