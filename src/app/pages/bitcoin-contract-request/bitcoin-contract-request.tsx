import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@stacks/ui';
import { Text } from '@stacks/ui';
import { AnyContract } from 'dlc-lib';

import useBitcoinContracts from '@app/common/hooks/use-bitcoin-contracts';
import { store } from '@app/store';

function BitcoinContractRequest() {
  const bitcoinContractHandler = useBitcoinContracts();
  const { offer, counterpartyWalletUrl } = useParams();

  const { selectedBitcoinContractID, bitcoinContracts } = store.getState().bitcoinContracts;
  const bitcoinState = store.getState().bitcoinContracts;

  const [selectedBitcoinContract, selectBitcoinContract] = useState<AnyContract>();

  useEffect(() => {
    if (offer && counterpartyWalletUrl) {
      bitcoinContractHandler.handleOffer(offer, counterpartyWalletUrl);
    }
  }, [offer, counterpartyWalletUrl]);

  useEffect(() => {
    if (selectedBitcoinContractID) {
      const bitcoinContractIndex = bitcoinContracts.findIndex(
        c =>
          c.id === selectedBitcoinContractID || c.temporaryContractId === selectedBitcoinContractID
      );
      selectBitcoinContract(bitcoinContracts[bitcoinContractIndex]);
    }
  }, [selectedBitcoinContractID, bitcoinContracts]);

  return (
    <>
      {selectedBitcoinContract && (
        <>
          <Text>'State:'{selectedBitcoinContract.state}</Text>
          <Button onClick={() => bitcoinContractHandler.handleAccept(selectedBitcoinContractID!)}>
            ACCEPT OFFER
          </Button>
          <Button onClick={() => bitcoinContractHandler.handleReject(selectedBitcoinContractID!)}>
            REJECT OFFER
          </Button>
        </>
      )}
    </>
  );
}

export default BitcoinContractRequest;
