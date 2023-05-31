import { useEffect } from 'react';
import { useState } from 'react';

import BigNumber from 'bignumber.js';
import { JsDLCInterface } from 'dlc-wasm-wallet';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { initialSearchParams } from '@app/common/initial-search-params';
import { PopupHeader } from '@app/features/current-account/popup-header';
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

interface CounterpartyWalletDetails {
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
}

function BitcoinContractRequest() {
  const bitcoinAccountDetails = useCurrentAccountNativeSegwitDetails();
  const bitcoinAccountBalance = useNativeSegwitBalance(bitcoinAccountDetails?.currentAddress!);

  const [bitcoinContractJSON, setBitcoinContractJSON] = useState<string>();
  const [bitcoinContract, setBitcoinContract] = useState<SimplifiedBitcoinContract>();
  const [counterpartyWalletDetails, setCounterpartyWalletDetails] =
    useState<CounterpartyWalletDetails>();
  const [canAcceptContract, setCanAcceptContract] = useState(false);
  const [isLoading, setLoading] = useState(true);

  function checkSufficientFunds(
    bitcoinContractCollateral: number,
    bitcoinAccountBalance: BigNumber
  ): boolean {
    const hasSufficientFunds = Number(bitcoinAccountBalance) >= bitcoinContractCollateral;
    return hasSufficientFunds;
  }

  function convertUint8ArrayToHexString(uint8Array: Uint8Array) {
    let hex = '';
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i].toString(16).padStart(2, '0');
      hex += byte;
    }
    return hex;
  }

  async function sendAcceptedBitcoinContractOfferToProtocolWallet(
    acceptedBitcoinContractOffer: string,
    counterpartyWalletURL: string
  ) {
    return fetch(`${counterpartyWalletURL}/offer/accept`, {
      method: 'put',
      body: JSON.stringify({
        acceptMessage: acceptedBitcoinContractOffer,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  }

  const handleReceivedOffer = (bitcoinContractOfferJSON: string) => {
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

    return simplifiedBitcoinContractOffer;
  };

  const handleAcceptClick = async () => {
    if (!bitcoinAccountDetails || !bitcoinContractJSON || !counterpartyWalletDetails) return;

    const { currentNetwork, currentAddress, currentAddressIndexKeychain } = bitcoinAccountDetails;
    const network = currentNetwork.chain.bitcoin.network;
    const privateKey = convertUint8ArrayToHexString(currentAddressIndexKeychain.privateKey!);
    const blockchainAPI = 'https://blockstream.info/testnet/api/';
    const oracleAPI = 'https://dev-oracle.dlc.link/oracle';

    console.log('network', network);
    console.log('currentAddress', currentAddress);
    console.log('privateKey', privateKey);
    console.log('blockchainAPI', blockchainAPI);
    console.log('oracleAPI', oracleAPI);

    const bitcoinContractInterface = await JsDLCInterface.new(
      privateKey,
      currentAddress,
      network,
      blockchainAPI,
      oracleAPI
    );
    try {
      const acceptedBitcoinContract = await bitcoinContractInterface.accept_offer(
        JSON.stringify(bitcoinContractJSON)
      );
      console.log('acceptedBitcoinContract', acceptedBitcoinContract);

      const signedBitcoinContract = await sendAcceptedBitcoinContractOfferToProtocolWallet(
        acceptedBitcoinContract,
        counterpartyWalletDetails.counterpartyWalletURL
      );
      console.log('signedBitcoinContract', signedBitcoinContract);

      const txID = await bitcoinContractInterface.countersign_and_broadcast(signedBitcoinContract);
      console.log('txID', txID);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectClick = async () => {};

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

    const simplifiedBitcoinContractOffer = handleReceivedOffer(bitcoinContractOfferJSON);

    const hasSufficientFunds = checkSufficientFunds(
      simplifiedBitcoinContractOffer.bitcoinContractCollateralAmount,
      bitcoinAccountBalance.balance.amount
    );

    const counterpartyWalletDetails = {
      counterpartyWalletURL,
      counterpartyWalletName,
      counterpartyWalletIcon,
    };

    setCounterpartyWalletDetails(counterpartyWalletDetails);
    setBitcoinContractJSON(bitcoinContractOfferJSON);
    setBitcoinContract(simplifiedBitcoinContractOffer);
    setCanAcceptContract(hasSufficientFunds);
    setLoading(false);
  }, []);

  return (
    <>
      {!isLoading && bitcoinContract && counterpartyWalletDetails && bitcoinAccountDetails && (
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
