import { useEffect } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Transaction } from 'bitcoinjs-lib';
import { ContractState, ContractUpdater, DlcManager, DlcSigner, getId } from 'dlc-lib';

import BitcoinBlockchainInterface from '@shared/models/bitcoin-blockchain-interface';
import BitcoinContractService from '@shared/models/bitcoin-contract-service';
import LocalBitcoinContractRepository from '@shared/models/local-bitcoin-contract-repository';
import { createMoneyFromDecimal } from '@shared/models/money.model';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useAppDispatch } from '@app/store';
import { RootState } from '@app/store';
import { useCurrentAccountNativeSegwitDetails } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import {
  requestOfferedContractAcceptance,
  requestOfferedContractProcess,
  requestOfferedContractRejection,
  updateContractsOnFailedAction,
  updateContractsOnSuccessfulAction,
} from '@app/store/bitcoin-contracts/bitcoin-contracts.slice';
import { FailedBitcoinContractDetails } from '@app/store/bitcoin-contracts/bitcoin-contracts.slice';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

import { initialSearchParams } from '../initial-search-params';
import { baseCurrencyAmountInQuote } from '../money/calculate-money';
import { i18nFormatCurrency } from '../money/format-money';
import { satToBtc } from '../money/unit-conversion';
import { useDefaultRequestParams } from './use-default-request-search-params';

const useBitcoinContracts = () => {
  const dispatch = useAppDispatch();
  const btcClient = useBitcoinClient();
  const navigate = useNavigate();

  const defaultParams = useDefaultRequestParams();

  const btcMarketData = useCryptoCurrencyMarketData('BTC');

  const btcBlockchainInterface = new BitcoinBlockchainInterface(
    (txid: string) => btcClient.transactionsApi.getRawBitcoinTransaction(txid),
    (txHex: string) => btcClient.transactionsApi.broadcastTransaction(txHex),
    (address: string) => btcClient.addressApi.getUtxosByAddress(address)
  );
  const btcContractStorage = new LocalBitcoinContractRepository();
  const btcContractSigner = new DlcSigner();
  const btcContractUpdater = new ContractUpdater(btcContractSigner, btcBlockchainInterface);
  const btcContractManager = new DlcManager(btcContractUpdater, btcContractStorage);
  const btcContractService = new BitcoinContractService(btcContractManager, btcContractStorage);

  const btcAccountDetails = useCurrentAccountNativeSegwitDetails();

  const {
    bitcoinContractCounterpartyWalletURL,
    bitcoinContractAcceptMessageSubmitted,
    bitcoinContractActionSuccessful,
    selectedBitcoinContractID,
  } = useSelector((state: RootState) => state.bitcoinContracts);

  const getFiatValue = useCallback(
    (value: string) =>
      i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(value), 'BTC'), btcMarketData)
      ),
    [btcMarketData]
  );


  useEffect(() => {
    const validateForSigning = async () => {
      const bitcoinContract = await getContract(selectedBitcoinContractID!);
      if (
        bitcoinContractAcceptMessageSubmitted &&
        bitcoinContractActionSuccessful &&
        bitcoinContract?.state === ContractState.Accepted
      ) {
        await handleSign(selectedBitcoinContractID!);
      }
    };
    validateForSigning();
  }, [
    bitcoinContractAcceptMessageSubmitted,
    bitcoinContractActionSuccessful,
    selectedBitcoinContractID,
  ]);

  async function getAllContracts() {
    const bitcoinContracts = await btcContractService.getAllContracts();
    return bitcoinContracts;
  }

  async function getContract(bitcoinContractID: string) {
    const bitcoinContract = await btcContractService.getContract(bitcoinContractID);
    return bitcoinContract;
  }

  async function handleOffer(bitcoinContractOffer: string, counterPartyWalletURL: string) {
    dispatch(requestOfferedContractProcess(counterPartyWalletURL));
    try {
      const bitcoinContract = await btcContractService.processContractOffer(bitcoinContractOffer);
      console.log('Handle Offer Success', bitcoinContract);
      dispatch(updateContractsOnSuccessfulAction(bitcoinContract));
    } catch (error) {
      const failedBitcoinContractDetails: FailedBitcoinContractDetails = {
        bitcoinContractID: '',
        bitcoinContractActionError: `Handle Offer Failure: ${error}`,
      };
      dispatch(updateContractsOnFailedAction(failedBitcoinContractDetails));
    }
  }

  async function handleAccept(bitcoinContractID: string) {
    const btcNetwork = btcAccountDetails?.currentNetwork.chain.bitcoin.network!
    const btcAddress = btcAccountDetails?.currentAddress!;
    const btcPrivateKey = uint8ArrayToHex(
      btcAccountDetails?.currentAddressIndexKeychain.privateKey!
    );
    const btcPublicKey = uint8ArrayToHex(btcAccountDetails?.currentAddressIndexKeychain.publicKey!);

    dispatch(requestOfferedContractAcceptance());
    try {
      const bitcoinContract = await btcContractService.acceptContract(
        bitcoinContractID,
        btcAddress,
        btcPublicKey,
        btcPrivateKey,
        btcNetwork
      );
      console.log('Handle Accept Success', bitcoinContract);
      dispatch(updateContractsOnSuccessfulAction(bitcoinContract));
    } catch (error) {
      const failedBitcoinContractDetails: FailedBitcoinContractDetails = {
        bitcoinContractID: bitcoinContractID,
        bitcoinContractActionError: `Handle Accept Failure: ${error}`,
      };
      dispatch(updateContractsOnFailedAction(failedBitcoinContractDetails));
    }
  }

  async function handleReject(bitcoinContractID: string) {
    dispatch(requestOfferedContractRejection());
    try {
      const bitcoinContract = await btcContractService.rejectContract(bitcoinContractID);
      console.log('Handle Reject Success', bitcoinContract);
      dispatch(updateContractsOnSuccessfulAction(bitcoinContract));
      chrome.tabs.sendMessage(
        defaultParams.tabId!,
        makeRpcSuccessResponse('acceptOffer', {
          id: initialSearchParams.get('requestID')!,
          contractID: bitcoinContract.temporaryContractId,
          action: 'reject',
        })
      );
      close();
    } catch (error) {
      const failedBitcoinContractDetails: FailedBitcoinContractDetails = {
        bitcoinContractID: bitcoinContractID,
        bitcoinContractActionError: `Handle Reject Failure: ${error}`,
      };
      dispatch(updateContractsOnFailedAction(failedBitcoinContractDetails));
    }
  }

  async function handleSign(bitcoinContractID: string) {
    const btcPrivateKey = uint8ArrayToHex(
      btcAccountDetails?.currentAddressIndexKeychain.privateKey!
    );

    try {
      const bitcoinContract = await btcContractService.processContractSign(
        bitcoinContractID,
        btcPrivateKey,
        bitcoinContractCounterpartyWalletURL!
      );
      console.log('Handle Sign Success', bitcoinContract);

      if (bitcoinContract.state === ContractState.Broadcast) {
        const txID = Transaction.fromHex(bitcoinContract.dlcTransactions.fund).getId();
        const btcCollateral = bitcoinContract.contractInfo.totalCollateral - bitcoinContract.offerParams.collateral;
        const txValue = satToBtc(btcCollateral).toString();
        const txFiatValue = getFiatValue(txValue);
        const txFiatValueSymbol = btcMarketData.price.symbol;
        const txLink = {
          blockchain: 'bitcoin',
          txid: txID,
        };

        navigate('/lock-bitcoin', {
          state: {
            txId: txID,
            txValue,
            txFiatValue,
            txFiatValueSymbol,
            symbol: 'BTC',
            txLink,
          },
        });

        chrome.tabs.sendMessage(
          defaultParams.tabId!,
          makeRpcSuccessResponse('acceptOffer', {
            id: initialSearchParams.get('requestID')!,
            contractID: bitcoinContract.temporaryContractId,
            txID: txID,
            action: 'broadcast',
          })
        );
      }
      dispatch(updateContractsOnSuccessfulAction(bitcoinContract));
    } catch (error) {
      const failedBitcoinContractDetails: FailedBitcoinContractDetails = {
        bitcoinContractID: bitcoinContractID,
        bitcoinContractActionError: `Handle Sign Failure: ${error}`,
      };
      dispatch(updateContractsOnFailedAction(failedBitcoinContractDetails));
    }
  }

  // useEffect(() => {
  //   if (error) {
  //     navigate('/tx-status', {
  //       state: {
  //         txid: '',
  //         currency: 'BTC',
  //         error: error,
  //         browserTx: true,
  //       },
  //     });
  //   }
  // }, [error]);

  return { getAllContracts, getContract, handleOffer, handleAccept, handleReject, handleSign };
};

function uint8ArrayToHex(uint8Array: Uint8Array) {
  let hex = '';
  for (let i = 0; i < uint8Array.length; i++) {
    const byte = uint8Array[i].toString(16).padStart(2, '0');
    hex += byte;
  }
  return hex;
}

export default useBitcoinContracts;
