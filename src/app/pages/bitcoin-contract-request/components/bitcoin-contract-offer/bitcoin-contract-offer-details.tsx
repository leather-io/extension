import { SimplifiedBitcoinContract } from '@app/common/hooks/use-bitcoin-contracts';

import { BitcoinContractExpirationDate } from './bitcoin-contract-expiration-date';
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
      <BitcoinContractExpirationDate
        expirationDate={bitcoinContractOffer.bitcoinContractExpirationDate}
      />
    </>
  );
}
