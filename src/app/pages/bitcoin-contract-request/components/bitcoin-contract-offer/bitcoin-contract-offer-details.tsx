import { AnyContract } from 'dlc-lib';

import { BitcoinContractExpirationDate } from './bitcoin-contract-expiration-date';
import { BitcoinContractOfferInput } from './bitcoin-contract-offer-input';
import { SimplifiedBitcoinContract } from '../../bitcoin-contract-request';

interface BitcoinContractOfferDetailsSimpleProps {
  bitcoinAddressNativeSegwit: string;
  bitcoinContractOffer: SimplifiedBitcoinContract;
}
export function BitcoinContractOfferDetailsSimple({
  bitcoinAddressNativeSegwit,
  bitcoinContractOffer,
}: BitcoinContractOfferDetailsSimpleProps) {
  return (
    <>
      <BitcoinContractOfferInput
        addressNativeSegwit={bitcoinAddressNativeSegwit}
        bitcoinContractOffer={bitcoinContractOffer}
      />
      <BitcoinContractExpirationDate
        expirationDate={bitcoinContractOffer.bitcoinContractExpirationDate}
      ></BitcoinContractExpirationDate>
    </>
  );
}
