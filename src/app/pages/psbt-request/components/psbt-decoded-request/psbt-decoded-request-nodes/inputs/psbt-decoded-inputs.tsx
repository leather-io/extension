import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';
import { Box, Text } from '@stacks/ui';

import { satToBtc } from '@app/common/money/unit-conversion';

import { PsbtBtcNodeLayout } from '../psbt-btc-node.layout';
import { PsbtPlaceholderNode } from '../psbt-placeholder-node';
import { PsbtDecodedInputLayout } from './psbt-decoded-input.layout';
import { PsbtInscription } from './psbt-inscription';
import { PsbtInscriptionLoader } from './psbt-inscription-loader';

interface PsbtDecodedInputsProps {
  addressNativeSegwit: string;
  inputs: btc.TransactionInputRequired[];
  showPlaceholder: boolean;
}
export function PsbtDecodedInputs({
  addressNativeSegwit,
  inputs,
  showPlaceholder,
}: PsbtDecodedInputsProps) {
  return (
    <Box background="white" borderTopLeftRadius="16px" borderTopRightRadius="16px" p="loose">
      <Text fontWeight={500}>Inputs</Text>
      {showPlaceholder ? (
        <PsbtPlaceholderNode />
      ) : (
        inputs.map(utxo => (
          <PsbtInscriptionLoader key={bytesToHex(utxo.txid)} utxo={utxo}>
            {txOutput => {
              if (!txOutput.address) return null;

              const isCurrentAddress = txOutput.address === addressNativeSegwit;
              const amount = satToBtc(txOutput.value).toString();

              return (
                <PsbtDecodedInputLayout address={txOutput.address}>
                  {txOutput.inscriptions ? (
                    <PsbtInscription path={txOutput.inscriptions} />
                  ) : (
                    <PsbtBtcNodeLayout
                      subtitle="Bitcoin"
                      value={`${isCurrentAddress ? '-' : '+'}${amount}`}
                    />
                  )}
                </PsbtDecodedInputLayout>
              );
            }}
          </PsbtInscriptionLoader>
        ))
      )}
    </Box>
  );
}
