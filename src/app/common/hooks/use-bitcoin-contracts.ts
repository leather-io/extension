import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { JsDLCInterface } from 'dlc-wasm-wallet';

import { createMoneyFromDecimal } from '@shared/models/money.model';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { CounterpartyWalletDetails } from '@app/pages/bitcoin-contract-request/bitcoin-contract-request';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountNativeSegwitDetails } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { initialSearchParams } from '../initial-search-params';
import { baseCurrencyAmountInQuote } from '../money/calculate-money';
import { i18nFormatCurrency } from '../money/format-money';
import { satToBtc } from '../money/unit-conversion';
import { useDefaultRequestParams } from './use-default-request-search-params';

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

const useBitcoinContracts = () => {
  const navigate = useNavigate();
  const defaultParams = useDefaultRequestParams();

  const bitcoinMarketData = useCryptoCurrencyMarketData('BTC');
  const bitcoinAccountDetails = useCurrentAccountNativeSegwitDetails();

  const getFiatValue = useCallback(
    (value: string) =>
      i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(value), 'BTC'), bitcoinMarketData)
      ),
    [bitcoinMarketData]
  );

  async function getAllContracts() {
    if (!bitcoinAccountDetails) return;

    const { currentNetwork, currentAddress, currentAddressIndexKeychain } = bitcoinAccountDetails;
    const network = currentNetwork.chain.bitcoin.network;
    const privateKey = convertUint8ArrayToHexString(currentAddressIndexKeychain.privateKey!);
    const blockchainAPI = 'https://blockstream.info/testnet/api';
    const oracleAPI = 'https://testnet.dlc.link/oracle';

    const bitcoinContractInterface = await JsDLCInterface.new(
      privateKey,
      currentAddress,
      network,
      blockchainAPI,
      oracleAPI
    );

    const bitcoinContracts = await bitcoinContractInterface.get_contracts();

    return bitcoinContracts;
  }

  async function getContract(bitcoinContractID: string) {
    if (!bitcoinAccountDetails) return;

    const { currentNetwork, currentAddress, currentAddressIndexKeychain } = bitcoinAccountDetails;
    const network = currentNetwork.chain.bitcoin.network;
    const privateKey = convertUint8ArrayToHexString(currentAddressIndexKeychain.privateKey!);
    const blockchainAPI = 'https://blockstream.info/testnet/api';
    const oracleAPI = 'https://testnet.dlc.link/oracle';

    const bitcoinContractInterface = await JsDLCInterface.new(
      privateKey,
      currentAddress,
      network,
      blockchainAPI,
      oracleAPI
    );

    const bitcoinContracts = await bitcoinContractInterface.get_contract(bitcoinContractID);

    return bitcoinContracts;
  }

  async function handleAccept(
    bitcoinContractJSON: string,
    counterpartyWalletDetails: CounterpartyWalletDetails
  ) {
    if (!bitcoinAccountDetails) return;

    const bitcoinContractOffer = JSON.parse(bitcoinContractJSON);

    const bitcoinContractID = bitcoinContractOffer.temporaryContractId;
    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;

    const { currentNetwork, currentAddress, currentAddressIndexKeychain } = bitcoinAccountDetails;
    const network = currentNetwork.chain.bitcoin.network;
    const privateKey = convertUint8ArrayToHexString(currentAddressIndexKeychain.privateKey!);
    const blockchainAPI = 'https://blockstream.info/testnet/api';
    const oracleAPI = 'https://dev-oracle.dlc.link/oracle';

    const bitcoinContractInterface = await JsDLCInterface.new(
      privateKey,
      currentAddress,
      network,
      blockchainAPI,
      oracleAPI
    );

    console.log('balance', await bitcoinContractInterface.get_wallet_balance());
    try {
      const acceptedBitcoinContract = await bitcoinContractInterface.accept_offer(
        bitcoinContractJSON
      );
      console.log('acceptedBitcoinContract', acceptedBitcoinContract);

      const signedBitcoinContract = await sendAcceptedBitcoinContractOfferToProtocolWallet(
        acceptedBitcoinContract,
        counterpartyWalletDetails.counterpartyWalletURL
      );
      console.log('signedBitcoinContract', signedBitcoinContract);

      const txID = await bitcoinContractInterface.countersign_and_broadcast(
        JSON.stringify(signedBitcoinContract)
      );
      console.log('txID', txID);

      const bitcoinCollateral = bitcoinContractCollateralAmount
      const txValue = satToBtc(bitcoinCollateral).toString();
      const txFiatValue = getFiatValue(txValue);
      const txFiatValueSymbol = bitcoinMarketData.price.symbol;
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
          contractID: bitcoinContractID,
          txID: txID,
          action: 'broadcast',
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReject(bitcoinContractID: string) {
    chrome.tabs.sendMessage(
      defaultParams.tabId!,
      makeRpcSuccessResponse('acceptOffer', {
        id: initialSearchParams.get('requestID')!,
        contractID: bitcoinContractID,
        action: 'reject',
      })
    );
    close();
  }

  return { getAllContracts, getContract, handleAccept, handleReject };
};

export default useBitcoinContracts;
