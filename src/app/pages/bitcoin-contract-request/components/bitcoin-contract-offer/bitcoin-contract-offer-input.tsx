import { useCalculateBitcoinFiatValue } from '@leather-wallet/query';
import { createMoneyFromDecimal, satToBtc, truncateMiddle } from '@leather-wallet/utils';
import { Stack, styled } from 'leather-styles/jsx';

import { SimplifiedBitcoinContract } from '@app/common/hooks/use-bitcoin-contracts';
import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';

import { BitcoinContractLockAmount } from './bitcoin-contract-lock-amount';

interface BitcoinContractOfferInputProps {
  addressNativeSegwit: string;
  bitcoinContractOffer: SimplifiedBitcoinContract;
}
export function BitcoinContractOfferInput({
  addressNativeSegwit,
  bitcoinContractOffer,
}: BitcoinContractOfferInputProps) {
  const calculateFiatValue = useCalculateBitcoinFiatValue();

  const bitcoinValue = satToBtc(bitcoinContractOffer.bitcoinContractCollateralAmount);
  const money = createMoneyFromDecimal(bitcoinValue, 'BTC');
  const fiatValue = calculateFiatValue(money);
  const formattedBitcoinValue = formatMoney(money);
  const formattedFiatValue = i18nFormatCurrency(fiatValue);

  return (
    <Stack gap="space.05" p="space.05" width="100%">
      <styled.span fontWeight={500}>Amount</styled.span>
      <BitcoinContractLockAmount
        hoverLabel={addressNativeSegwit}
        subtitle={truncateMiddle(addressNativeSegwit)}
        subValue={`${formattedFiatValue} USD`}
        value={formattedBitcoinValue}
      />
    </Stack>
  );
}
