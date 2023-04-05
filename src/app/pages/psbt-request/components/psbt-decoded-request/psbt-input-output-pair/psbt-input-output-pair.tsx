import { useCallback } from 'react';

import { Box, Text } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';
import { createMoneyFromDecimal } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { InputsOutputPair } from '../../../hooks/match-inputs-and-outputs';
import { PsbtDecodedNodeLayout } from './psbt-decoded-node.layout';
import { PsbtInputWithInscription } from './psbt-input-with-inscription';

interface PsbtInputOutputPairProps {
  addressNativeSegwit: string;
  addressTaproot: string;
  inputOutputPair: InputsOutputPair;
  isFirstPair: boolean;
  isLastPair: boolean;
}
export function PsbtInputOutputPair({
  addressNativeSegwit,
  addressTaproot,
  inputOutputPair,
  isFirstPair,
  isLastPair,
}: PsbtInputOutputPairProps) {
  const { inputs, output } = inputOutputPair;
  const network = useCurrentNetwork();
  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const addressFromScript = getAddressFromOutScript(output.script, network.chain.bitcoin.network);

  const getFiatValue = useCallback(
    (value: string) =>
      i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(value), 'BTC'), btcMarketData)
      ),
    [btcMarketData]
  );

  const isOutputCurrentAddress =
    addressFromScript === addressNativeSegwit || addressFromScript === addressTaproot;
  const outputValue = satToBtc(Number(output.amount)).toString();

  return (
    <Box
      background="white"
      borderBottomLeftRadius={isLastPair ? '16px' : 'unset'}
      borderBottomRightRadius={isLastPair ? '16px' : 'unset'}
      borderTopLeftRadius={isFirstPair ? '16px' : 'unset'}
      borderTopRightRadius={isFirstPair ? '16px' : 'unset'}
      p="loose"
    >
      <Text fontWeight={500}>Inputs</Text>
      {inputs.map(input => {
        const isInputCurrentAddress =
          input.address === addressNativeSegwit || input.address === addressTaproot;
        const inputValue = satToBtc(input.value).toString();
        const fiatValue = getFiatValue(inputValue);
        const inscription = input.unsignedUtxo?.inscriptions;

        return inscription ? (
          <PsbtInputWithInscription
            address={input.address}
            inputValue={inputValue}
            path={inscription}
          />
        ) : (
          <PsbtDecodedNodeLayout
            hoverLabel={input.address}
            subtitle={truncateMiddle(input.address)}
            subValue={`${fiatValue} USD`}
            value={`${isInputCurrentAddress ? '-' : '+'} ${inputValue}`}
          />
        );
      })}
      <hr />
      <Text fontWeight={500} mt="loose">
        Output
      </Text>
      <PsbtDecodedNodeLayout
        hoverLabel={addressFromScript}
        subtitle={truncateMiddle(addressFromScript)}
        subValue={`${getFiatValue(outputValue)} USD`}
        value={`${isOutputCurrentAddress ? '+' : ' '} ${outputValue}`}
      />
    </Box>
  );
}
