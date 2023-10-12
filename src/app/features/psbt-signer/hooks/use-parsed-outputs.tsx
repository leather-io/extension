import { useMemo } from 'react';

import * as btc from '@scure/btc-signer';

import { NetworkConfiguration } from '@shared/constants';
import { getBtcSignerLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';
import { logger } from '@shared/logger';
import { isDefined, isUndefined } from '@shared/utils';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

export interface PsbtOutput {
  address: string;
  isMutable: boolean;
  toSign: boolean;
  value: number;
}

interface UseParsedOutputsArgs {
  isPsbtMutable: boolean;
  outputs: btc.TransactionOutput[];
  network: NetworkConfiguration;
}
export function useParsedOutputs({ isPsbtMutable, outputs, network }: UseParsedOutputsArgs) {
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const bitcoinNetwork = getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.bitcoinNetwork);

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
