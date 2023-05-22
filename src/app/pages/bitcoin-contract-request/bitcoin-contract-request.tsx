import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Button } from '@stacks/ui';
import { Text } from '@stacks/ui';
import { AnyContract } from 'dlc-lib';

import useBitcoinContracts from '@app/common/hooks/use-bitcoin-contracts';
import { RootState, useAppDispatch } from '@app/store';
import { store } from '@app/store';
import { requestClearState } from '@app/store/bitcoin-contracts/bitcoin-contracts.slice';

function BitcoinContractRequest() {
  const bitcoinContractHandler = useBitcoinContracts();
  const dispatch = useAppDispatch();

  const { offer, counterpartyWalletUrl } = useParams();

  const {
    selectedBitcoinContractID,
    bitcoinContractActionError,
    bitcoinContractProcessing,
  } = useSelector((state: RootState) => state.bitcoinContracts);

  const bitcoinContractsSlice = store.getState().bitcoinContracts;

  const [selectedBitcoinContract, selectBitcoinContract] = useState<AnyContract>();
  const [isLoading, setLoading] = useState(true);

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
    if (!offer || !counterpartyWalletUrl) {
      return;
    }
    handleReceivedOffer(offer, counterpartyWalletUrl);
  }, [offer, counterpartyWalletUrl]);

  useEffect(() => {
    if (!selectedBitcoinContractID) {
      return;
    }
    getBitcoinContract(selectedBitcoinContractID).then(bitcoinContract => {
      selectBitcoinContract(bitcoinContract);
    });
  }, [selectedBitcoinContractID]);

  useEffect(() => {
    if (bitcoinContractActionError) {
      console.error(bitcoinContractActionError);
    }
  }, [bitcoinContractActionError]);

  return (
    <>
      {!isLoading && (
        <>
          {bitcoinContractActionError === undefined ? (
            <>
              <Text>'State:'{selectedBitcoinContract?.state}</Text>
              <Button onClick={() => handleAcceptClick(selectedBitcoinContractID!)}>
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
