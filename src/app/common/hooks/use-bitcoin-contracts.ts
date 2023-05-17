import { useEffect } from 'react';

import { ContractState, ContractUpdater, DlcManager, DlcSigner, getId } from 'dlc-lib';
import { NetworkType } from 'dlc-lib/src/types/networkTypes';

import BitcoinBlockchainInterface from '@shared/models/bitcoin-blockchain-interface';
import BitcoinContractService from '@shared/models/bitcoin-contract-service';
import LocalBitcoinContractRepository from '@shared/models/local-bitcoin-contract-repository';

import { useAppDispatch } from '@app/store';
import { store } from '@app/store';
import {
  useCurrentBitcoinNativeSegwitAddressIndexPublicKeychain,
  useCurrentBtcNativeSegwitAccountAddressIndexZero,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import {
  requestOfferedContractAcceptance,
  requestOfferedContractProcess,
  requestOfferedContractRejection,
  requestOfferedContractSigning,
  updateContractsOnFailedAction,
  updateContractsOnSuccessfulAction,
} from '@app/store/bitcoin-contracts/bitcoin-contracts.slice';
import { FailedBitcoinContractDetails } from '@app/store/bitcoin-contracts/bitcoin-contracts.slice';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

const useBitcoinContracts = () => {
  const dispatch = useAppDispatch();
  const btcClient = useBitcoinClient();

  const btcBlockchainInterface = new BitcoinBlockchainInterface(
    (txid: string) => btcClient.transactionsApi.getBitcoinTransaction(txid),
    (txHex: string) => btcClient.transactionsApi.broadcastTransaction(txHex),
    (address: string) => btcClient.addressApi.getUtxosByAddress(address)
  );
  const btcContractStorage = new LocalBitcoinContractRepository();
  const btcContractSigner = new DlcSigner();
  const btcContractUpdater = new ContractUpdater(btcContractSigner, btcBlockchainInterface);
  const btcContractManager = new DlcManager(btcContractUpdater, btcContractStorage);
  const btcContractService = new BitcoinContractService(btcContractManager, btcContractStorage);

  const currentNetwork = useCurrentNetwork();
  const btcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const btcKeychain = useCurrentBitcoinNativeSegwitAddressIndexPublicKeychain();

  const {
    bitcoinContractCounterpartyWalletURL,
    bitcoinContractProcessing,
    bitcoinContractAcceptMessageSubmitted,
    bitcoinContractSigningRequested,
    bitcoinContractActionSuccessful,
    bitcoinContractActionError,
    bitcoinContracts,
    selectedBitcoinContractID,
  } = store.getState().bitcoinContracts;

  let btcNetwork: NetworkType;

  useEffect(() => {
    switch (currentNetwork.chain.bitcoin.network) {
      case 'mainnet':
        btcNetwork = 'Mainnet';
        break;
      case 'testnet':
        btcNetwork = 'Testnet';
        break;
      case 'regtest':
        btcNetwork = 'Regtest';
        break;
      default:
        btcNetwork = 'Testnet';
    }
  }, [currentNetwork]);

  useEffect(() => {
    const bitcoinContract = bitcoinContracts.find(
      c =>
        getId(c) === selectedBitcoinContractID ||
        c.temporaryContractId === selectedBitcoinContractID
    );
    if (
      bitcoinContractAcceptMessageSubmitted &&
      bitcoinContractActionSuccessful &&
      bitcoinContractSigningRequested &&
      bitcoinContract?.state === ContractState.Accepted
    ) {
      handleSign(selectedBitcoinContractID!);
    }
  }, [
    bitcoinContractAcceptMessageSubmitted,
    bitcoinContractActionSuccessful,
    bitcoinContractSigningRequested,
    selectedBitcoinContractID,
  ]);

  async function handleOffer(bitcoinContractOffer: string, counterPartyWalletURL: string) {
    console.log('Handle Offer Effect')
    dispatch(requestOfferedContractProcess(counterPartyWalletURL));
    try {
      const bitcoinContract = await btcContractService.processContractOffer(bitcoinContractOffer);
      console.log('Handle Offer Effect Success', bitcoinContract)
      dispatch(updateContractsOnSuccessfulAction(bitcoinContract));
    } catch (error) {
      const failedBitcoinContractDetails: FailedBitcoinContractDetails = {
        bitcoinContractID: '',
        bitcoinContractActionError: `HandleOffer Effect Failure: ${error}`,
      };
      dispatch(updateContractsOnFailedAction(failedBitcoinContractDetails));
    }
  }

  async function handleAccept(bitcoinContractID: string) {
    const btcPublicKey = String.fromCharCode(...btcKeychain?.publicKey!);
    const btcPrivateKey = String.fromCharCode(...btcKeychain?.privateKey!);

    dispatch(requestOfferedContractAcceptance());
    try {
      const bitcoinContract = await btcContractService.acceptContract(
        bitcoinContractID,
        btcAddress,
        btcPublicKey,
        btcPrivateKey,
        btcNetwork
      );
      dispatch(updateContractsOnSuccessfulAction(bitcoinContract));
    } catch (error) {
      const failedBitcoinContractDetails: FailedBitcoinContractDetails = {
        bitcoinContractID: bitcoinContractID,
        bitcoinContractActionError: `HandleAccept Effect Failure: ${error}`,
      };
      dispatch(updateContractsOnFailedAction(failedBitcoinContractDetails));
    }
  }

  async function handleReject(bitcoinContractID: string) {
    dispatch(requestOfferedContractRejection());
    try {
      const bitcoinContract = await btcContractService.rejectContract(bitcoinContractID);
      dispatch(updateContractsOnSuccessfulAction(bitcoinContract));
    } catch (error) {
      const failedBitcoinContractDetails: FailedBitcoinContractDetails = {
        bitcoinContractID: bitcoinContractID,
        bitcoinContractActionError: `HandleReject Effect Failure: ${error}`,
      };
      dispatch(updateContractsOnFailedAction(failedBitcoinContractDetails));
    }
  }

  async function handleSign(bitcoinContractID: string) {
    const btcPrivateKey = String.fromCharCode(...btcKeychain?.privateKey!);

    dispatch(requestOfferedContractSigning());
    try {
      const bitcoinContract = await btcContractService.processContractSign(
        bitcoinContractID,
        btcPrivateKey,
        bitcoinContractCounterpartyWalletURL!
      );
      dispatch(updateContractsOnSuccessfulAction(bitcoinContract));
    } catch (error) {
      const failedBitcoinContractDetails: FailedBitcoinContractDetails = {
        bitcoinContractID: bitcoinContractID,
        bitcoinContractActionError: `HandleSign Effect Failure: ${error}`,
      };
      dispatch(updateContractsOnFailedAction(failedBitcoinContractDetails));
    }
  }

  return { handleOffer, handleAccept, handleReject, handleSign };
};

export default useBitcoinContracts;
