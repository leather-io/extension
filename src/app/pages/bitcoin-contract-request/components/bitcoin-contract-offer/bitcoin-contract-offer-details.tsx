import { SimplifiedBitcoinContract } from '@app/common/hooks/use-bitcoin-contracts';

import { BitcoinContractEmergencyRefundTime } from './bitcoin-contract-emergency-refund-time';
import { BitcoinContractOfferInput } from './bitcoin-contract-offer-input';

interface BitcoinContractOfferDetailsSimpleProps {
  bitcoinAddress: string;
  bitcoinContractOffer: SimplifiedBitcoinContract;
}
export function BitcoinContractOfferDetailsSimple({
  bitcoinAddress,
  bitcoinContractOffer,
}: BitcoinContractOfferDetailsSimpleProps) {
  return (
    <>
      <BitcoinContractOfferInput
        addressNativeSegwit={bitcoinAddress}
        bitcoinContractOffer={bitcoinContractOffer}
      />
      <BitcoinContractEmergencyRefundTime
        emergencyRefundTime={bitcoinContractOffer.bitcoinContractEmergencyRefundTime}
      />
    </>
  );
}
