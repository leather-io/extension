import { useEffect } from 'react';
import { useState } from 'react';

import BigNumber from 'bignumber.js';

import useBitcoinContracts from '@app/common/hooks/use-bitcoin-contracts';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCurrentAccountNativeSegwitDetails } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { BitcoinContractOfferDetailsSimple } from './components/bitcoin-contract-offer/bitcoin-contract-offer-details';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request-layout';
import { BitcoinContractRequestWarningLabel } from './components/bitcoin-contract-request-warning-label';

export interface SimplifiedBitcoinContract {
  bitcoinContractID: string;
  bitcoinContractCollateralAmount: number;
  bitcoinContractExpirationDate: string;
}

export interface CounterpartyWalletDetails {
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
}

function BitcoinContractRequest() {
  const bitcoinAccountDetails = useCurrentAccountNativeSegwitDetails();
  const bitcoinAccountBalance = useNativeSegwitBalance(bitcoinAccountDetails?.currentAddress!);
  const { handleAccept, handleReject } = useBitcoinContracts();

  const [bitcoinContractJSON, setBitcoinContractJSON] = useState<string>();
  const [bitcoinContract, setBitcoinContract] = useState<SimplifiedBitcoinContract>();
  const [counterpartyWalletDetails, setCounterpartyWalletDetails] =
    useState<CounterpartyWalletDetails>();
  const [canAcceptContract, setCanAcceptContract] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const checkSufficientFunds = (
    bitcoinContractCollateral: number,
    bitcoinAccountBalance: BigNumber
  ): boolean => {
    const hasSufficientFunds = Number(bitcoinAccountBalance) >= bitcoinContractCollateral;
    return hasSufficientFunds;
  };

  const handleReceivedOffer = (
    bitcoinContractOfferJSON: string,
    counterpartyWalletURL: string,
    counterpartyWalletName: string,
    counterpartyWalletIcon: string
  ) => {
    const bitcoinContractOffer = JSON.parse(bitcoinContractOfferJSON);

    const bitcoinContractID = bitcoinContractOffer.temporaryContractId;
    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;
    const bitcoinContractExpirationDate = new Date(
      bitcoinContractOffer.cetLocktime * 1000
    ).toLocaleDateString();

    const simplifiedBitcoinContractOffer: SimplifiedBitcoinContract = {
      bitcoinContractID,
      bitcoinContractCollateralAmount,
      bitcoinContractExpirationDate,
    };

    const counterpartyWalletDetails: CounterpartyWalletDetails = {
      counterpartyWalletURL,
      counterpartyWalletName,
      counterpartyWalletIcon,
    };

    return { simplifiedBitcoinContractOffer, counterpartyWalletDetails };
  };

  const handleAcceptClick = async () => {
    if (
      !bitcoinAccountDetails ||
      !bitcoinContractJSON ||
      !counterpartyWalletDetails ||
      !bitcoinContract
    )
      return;
    await handleAccept(bitcoinContractJSON, counterpartyWalletDetails);
  };

  const handleRejectClick = async () => {
    if (!bitcoinContract) return;
    await handleReject(bitcoinContract.bitcoinContractID);
  };

  useEffect(() => {
    const bitcoinContractOfferJSON = initialSearchParams.get('bitcoinContractOffer');
    const counterpartyWalletURL = initialSearchParams.get('counterpartyWalletURL');
    const counterpartyWalletName = initialSearchParams.get('counterpartyWalletName');
    const counterpartyWalletIcon = initialSearchParams.get('counterpartyWalletIcon');

    if (
      !bitcoinContractOfferJSON ||
      !counterpartyWalletURL ||
      !counterpartyWalletName ||
      !counterpartyWalletIcon ||
      !bitcoinAccountDetails
    )
      return;

    const { simplifiedBitcoinContractOffer, counterpartyWalletDetails } = handleReceivedOffer(
      bitcoinContractOfferJSON,
      counterpartyWalletURL,
      counterpartyWalletName,
      counterpartyWalletIcon
    );

    const hasSufficientFunds = checkSufficientFunds(
      simplifiedBitcoinContractOffer.bitcoinContractCollateralAmount,
      bitcoinAccountBalance.balance.amount
    );

    setCounterpartyWalletDetails(counterpartyWalletDetails);
    setBitcoinContractJSON(bitcoinContractOfferJSON);
    setBitcoinContract(simplifiedBitcoinContractOffer);
    setCanAcceptContract(hasSufficientFunds);
    setLoading(false);
  }, []);

  return (
    <>
      {!isLoading &&
        bitcoinAccountDetails &&
        bitcoinAccountDetails.currentAddress &&
        bitcoinContract &&
        counterpartyWalletDetails && (
          <BitcoinContractRequestLayout>
            <BitcoinContractRequestHeader
              counterpartyWalletName={counterpartyWalletDetails.counterpartyWalletName}
              counterpartyWalletIcon={counterpartyWalletDetails.counterpartyWalletIcon}
            />
            <BitcoinContractRequestWarningLabel
              appName={counterpartyWalletDetails.counterpartyWalletName}
            />
            <BitcoinContractRequestActions
              isLoading={isLoading}
              canAccept={canAcceptContract}
              onRejectBitcoinContractOffer={handleRejectClick}
              onAcceptBitcoinContractOffer={handleAcceptClick}
            />
            <BitcoinContractOfferDetailsSimple
              bitcoinAddressNativeSegwit={bitcoinAccountDetails.currentAddress}
              bitcoinContractOffer={bitcoinContract}
            />
          </BitcoinContractRequestLayout>
        )}
    </>
  );
}

export default BitcoinContractRequest;
