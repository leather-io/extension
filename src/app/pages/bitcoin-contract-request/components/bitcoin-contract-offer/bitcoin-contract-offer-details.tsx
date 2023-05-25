import { AnyContract } from 'dlc-lib';

import { BitcoinContractExpirationDate } from './bitcoin-contract-expiration-date';
import { BitcoinContractOfferInput } from './bitcoin-contract-offer-input';

interface BitcoinContractOfferDetailsSimpleProps {
  bitcoinAddressNativeSegwit: string;
  bitcoinContractOffer: AnyContract;
  bitcoinContractExpirationDate: string;
}
export function BitcoinContractOfferDetailsSimple({
  bitcoinAddressNativeSegwit,
  bitcoinContractOffer,
  bitcoinContractExpirationDate,
}: BitcoinContractOfferDetailsSimpleProps) {
  return (
    <>
      <BitcoinContractOfferInput
        addressNativeSegwit={bitcoinAddressNativeSegwit}
        bitcoinContractOffer={bitcoinContractOffer}
      />
      <BitcoinContractExpirationDate
        expirationDate={bitcoinContractExpirationDate}
      ></BitcoinContractExpirationDate>
    </>
  );
}
