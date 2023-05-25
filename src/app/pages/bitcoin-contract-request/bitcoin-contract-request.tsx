import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { AnyContract } from 'dlc-lib';

import useBitcoinContracts from '@app/common/hooks/use-bitcoin-contracts';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { initialSearchParams } from '@app/common/initial-search-params';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { RootState, useAppDispatch } from '@app/store';
import { useCurrentAccountNativeSegwitDetails } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { requestClearState } from '@app/store/bitcoin-contracts/bitcoin-contracts.slice';

import { BitcoinContractOfferDetailsSimple } from './components/bitcoin-contract-offer/bitcoin-contract-offer-details';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request-layout';
import { BitcoinContractRequestWarningLabel } from './components/bitcoin-contract-request-warning-label';

function BitcoinContractRequest() {
  const bitcoinContractHandler = useBitcoinContracts();
  const dispatch = useAppDispatch();
  useRouteHeader(<PopupHeader displayAddresssBalanceOf="all" />);

  const { selectedBitcoinContractID, bitcoinContractProcessing } = useSelector(
    (state: RootState) => state.bitcoinContracts
  );

  const btcAccountDetails = useCurrentAccountNativeSegwitDetails();
  const bitcoinBalance = useNativeSegwitBalance(btcAccountDetails?.currentAddress!);

  const [selectedBitcoinContract, selectBitcoinContract] = useState<AnyContract>();
  const [counterpartyWalletURL, setCounterpartyWalletURL] = useState<string>();
  const [counterpartyWalletName, setCounterpartyWalletName] = useState<string>();
  const [counterpartyWalletIcon, setCounterpartyWalletIcon] = useState<string>();
  const [contractMaturityBound, setContractMaturityBound] = useState<string>();
  const [canAccept, setCanAccept] = useState(false);
  const [isLoading, setLoading] = useState(true);

  function calculateAndSetCanAccept(totalCollateral: number, offerorCollateral: number): void {
    const btcCollateralAmount = totalCollateral - offerorCollateral;
    const updatedCanAccept = Number(bitcoinBalance.balance.amount) >= btcCollateralAmount;
    setCanAccept(updatedCanAccept);
  }

  function formatAndSetContractMaturityBound(contractMaturityBound: number): void {
    const formattedContractMaturityBound = new Date(
      contractMaturityBound * 1000
    ).toLocaleDateString();
    setContractMaturityBound(formattedContractMaturityBound);
  }

  const handleReceivedOffer = async (
    bitcoinContractOffer: string,
    counterpartyWalletURL: string
  ) => {
    await bitcoinContractHandler.handleOffer(bitcoinContractOffer, counterpartyWalletURL);
    setLoading(false);
  };

  const handleAcceptClick = async () => {
    await bitcoinContractHandler.handleAccept(selectedBitcoinContractID!);
  };

  const handleRejectClick = async () => {
    await bitcoinContractHandler.handleReject(selectedBitcoinContractID!);
  };

  const getBitcoinContract = async (bitcoinContractID: string) => {
    const bitcoinContract = await bitcoinContractHandler.getContract(bitcoinContractID);
    return bitcoinContract;
  };

  useEffect(() => {
    dispatch(requestClearState());
  }, []);

  useEffect(() => {
    const bitcoinContractOffer = initialSearchParams.get('bitcoinContractOffer');
    const counterpartyWalletURL = initialSearchParams.get('counterpartyWalletURL');
    const counterpartyWalletName = initialSearchParams.get('counterpartyWalletName');
    const counterpartyWalletIcon = initialSearchParams.get('counterpartyWalletIcon');

    if (
      !bitcoinContractOffer ||
      !counterpartyWalletURL ||
      !counterpartyWalletName ||
      !counterpartyWalletIcon
    )
      return;

    setCounterpartyWalletURL(counterpartyWalletURL);
    setCounterpartyWalletName(counterpartyWalletName);
    setCounterpartyWalletIcon(counterpartyWalletIcon);
    handleReceivedOffer(bitcoinContractOffer, counterpartyWalletURL);
  }, []);

  useEffect(() => {
    if (!selectedBitcoinContractID) {
      return;
    }
    getBitcoinContract(selectedBitcoinContractID).then(bitcoinContract => {
      selectBitcoinContract(bitcoinContract);
      calculateAndSetCanAccept(
        bitcoinContract?.contractInfo.totalCollateral!,
        bitcoinContract?.offerParams.collateral!
      );
      formatAndSetContractMaturityBound(bitcoinContract.contractMaturityBound!);
    });
  }, [selectedBitcoinContractID]);

  return (
    <>
      {!isLoading && selectedBitcoinContract && contractMaturityBound && (
        <BitcoinContractRequestLayout>
          <BitcoinContractRequestHeader
            counterpartyWalletName={counterpartyWalletName!}
            counterpartyWalletIcon={counterpartyWalletIcon!}
          />
          <BitcoinContractRequestWarningLabel appName="DLC.Link" />
          <BitcoinContractRequestActions
            onReject={handleRejectClick}
            onAcceptBitcoinContractOffer={handleAcceptClick}
            isLoading={bitcoinContractProcessing}
          />
          <BitcoinContractOfferDetailsSimple
            bitcoinAddressNativeSegwit={btcAccountDetails?.currentAddress!}
            bitcoinContractOffer={selectedBitcoinContract}
            bitcoinContractExpirationDate={contractMaturityBound!}
          />
        </BitcoinContractRequestLayout>
      )}
    </>
  );
}

export default BitcoinContractRequest;
