import { useCallback } from 'react';

import { Box, Text } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { AnyContract } from 'dlc-lib';

import { getAddressFromOutScript } from '@shared/crypto/bitcoin/bitcoin.utils';
import { createMoneyFromDecimal } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

import { BitcoinContractLockAmount } from './bitcoin-contract-lock-amount';

interface BitcoinContractOfferInputProps {
  addressNativeSegwit: string;
  bitcoinContractOffer: AnyContract;
}
export function BitcoinContractOfferInput({
  addressNativeSegwit,
  bitcoinContractOffer,
}: BitcoinContractOfferInputProps) {
  const btcMarketData = useCryptoCurrencyMarketData('BTC');

  const getFiatValue = useCallback(
    (value: string) =>
      i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(value), 'BTC'), btcMarketData)
      ),
    [btcMarketData]
  );

  const collateral = bitcoinContractOffer.contractInfo.totalCollateral - bitcoinContractOffer.offerParams.collateral;
  const inputValue = satToBtc(collateral).toString();
  const fiatValue = getFiatValue(inputValue);

  return (
    <Box
      background="white"
      borderBottomLeftRadius={'16px'}
      borderBottomRightRadius={'16px'}
      borderTopLeftRadius={'16px'}
      borderTopRightRadius={'16px'}
      p="loose"
    >
      <Text fontWeight={500}>Amount</Text>
          <BitcoinContractLockAmount
            hoverLabel={addressNativeSegwit}
            subtitle={truncateMiddle(addressNativeSegwit)}
            subValue={`${fiatValue} USD`}
            value={inputValue}
          />
      <hr />
    </Box>
  );
}
