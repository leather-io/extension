import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@stacks/ui';
import { Text } from '@stacks/ui';
import { AnyContract } from 'dlc-lib';

import useBitcoinContracts from '@app/common/hooks/use-bitcoin-contracts';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { RootState, useAppDispatch } from '@app/store';
import { useCurrentAccountNativeSegwitDetails } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { requestClearState } from '@app/store/bitcoin-contracts/bitcoin-contracts.slice';

function BitcoinContractRequest() {
  const bitcoinContractHandler = useBitcoinContracts();
  const dispatch = useAppDispatch();

  const { selectedBitcoinContractID, bitcoinContractActionError, bitcoinContractProcessing } =
    useSelector((state: RootState) => state.bitcoinContracts);

  const btcAccountDetails = useCurrentAccountNativeSegwitDetails();
  const bitcoinBalance = useNativeSegwitBalance(btcAccountDetails?.currentAddress!);

  const [selectedBitcoinContract, selectBitcoinContract] = useState<AnyContract>();
  const [canAccept, setCanAccept] = useState(false);
  const [isLoading, setLoading] = useState(true);

  function calculateAndSetCanAccept(totalCollateral: number, offerorCollateral: number): void {
    console.log('calculateAndSetCanAccept', Number(bitcoinBalance.balance.amount));
    const btcCollateralAmount = totalCollateral - offerorCollateral;
    const updatedCanAccept = Number(bitcoinBalance.balance.amount) >= btcCollateralAmount;
    setCanAccept(updatedCanAccept);
  }

  const handleReceivedOffer = async (
    bitcoinContractOffer: string,
    counterpartyWalletURL: string
  ) => {
    await bitcoinContractHandler.handleOffer(bitcoinContractOffer, counterpartyWalletURL);
    setLoading(false);
  };

  const handleAcceptClick = async (bitcoinContractID: string) => {
    await bitcoinContractHandler.handleAccept(bitcoinContractID);
  };

  const handleRejectClick = async (bitcoinContractID: string) => {
    await bitcoinContractHandler.handleReject(bitcoinContractID);
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

    if (!bitcoinContractOffer || !counterpartyWalletURL) return;

    handleReceivedOffer(bitcoinContractOffer, counterpartyWalletURL);
  }, []);

  useEffect(() => {
    if (!selectedBitcoinContractID) {
      return;
    }
    getBitcoinContract(selectedBitcoinContractID).then(bitcoinContract => {
      selectBitcoinContract(bitcoinContract);
    });
    calculateAndSetCanAccept(
      selectedBitcoinContract?.contractInfo.totalCollateral!,
      selectedBitcoinContract?.offerParams.collateral!
    );
  }, [selectedBitcoinContractID]);

  return (
    <>
      {!isLoading && (
        <>
          {bitcoinContractActionError === undefined ? (
            <>
              <Text>'State:'{selectedBitcoinContract?.state}</Text>
              <Button
                isDisabled={canAccept}
                onClick={() => handleAcceptClick(selectedBitcoinContractID!)}
              >
                ACCEPT OFFER
              </Button>
              <Button onClick={() => handleRejectClick(selectedBitcoinContractID!)}>
                REJECT OFFER
              </Button>
            </>
          ) : (
            <Text>{bitcoinContractActionError}</Text>
          )}
        </>
      )}
      {bitcoinContractProcessing && <Text>Processing...</Text>}
    </>
  );
}

export default BitcoinContractRequest;
