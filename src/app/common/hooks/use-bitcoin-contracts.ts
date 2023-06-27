import { useNavigate } from 'react-router-dom';

import { bytesToHex } from '@stacks/common';
import { JsDLCInterface } from 'dlc-wasm-wallet';

import { BITCOIN_API_BASE_URL_MAINNET, BITCOIN_API_BASE_URL_TESTNET } from '@shared/constants';
import { deriveAddressIndexKeychainFromAccount } from '@shared/crypto/bitcoin/bitcoin.utils';
import { createMoneyFromDecimal } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { sendAcceptedBitcoinContractOfferToProtocolWallet } from '@app/query/bitcoin/contract/send-accepted-bitcoin-contract-offer';
import {
  useCalculateBitcoinFiatValue,
  useCryptoCurrencyMarketData,
} from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import {
  useCurrentAccountNativeSegwitSigner,
  useNativeSegwitActiveNetworkAccountPrivateKeychain,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { initialSearchParams } from '../initial-search-params';
import { i18nFormatCurrency } from '../money/format-money';
import { satToBtc } from '../money/unit-conversion';
import { whenBitcoinNetwork } from '../utils';
import { useDefaultRequestParams } from './use-default-request-search-params';

export interface SimplifiedBitcoinContract {
  bitcoinContractId: string;
  bitcoinContractCollateralAmount: number;
  bitcoinContractExpirationDate: string;
}

interface CounterpartyWalletDetails {
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
}

export interface BitcoinContractOfferDetails {
  simplifiedBitcoinContract: SimplifiedBitcoinContract;
  counterpartyWalletDetails: CounterpartyWalletDetails;
}

export function useBitcoinContracts() {
  const navigate = useNavigate();
  const defaultParams = useDefaultRequestParams();
  const bitcoinMarketData = useCryptoCurrencyMarketData('BTC');
  const calculateFiatValue = useCalculateBitcoinFiatValue();
  const getNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const currentIndex = useCurrentAccountIndex();
  const nativeSegwitPrivateKeychain =
    useNativeSegwitActiveNetworkAccountPrivateKeychain()?.(currentIndex);
  const oracleAPI = 'https://testnet.dlc.link/oracle';

  async function getBitcoinContractInterface(): Promise<JsDLCInterface | undefined> {
    const bitcoinAccountDetails = getNativeSegwitSigner?.(0);

    if (!nativeSegwitPrivateKeychain || !bitcoinAccountDetails) return;

    const currentBitcoinNetwork = bitcoinAccountDetails.network;
    const currentAddress = bitcoinAccountDetails.address;
    const currentAccountIndex = bitcoinAccountDetails.addressIndex;

    const currentAddressPrivateKey = deriveAddressIndexKeychainFromAccount(
      nativeSegwitPrivateKeychain
    )(currentAccountIndex).privateKey;

    if (!currentAddressPrivateKey) return;

    const blockchainAPI = whenBitcoinNetwork(currentBitcoinNetwork)({
      mainnet: BITCOIN_API_BASE_URL_MAINNET,
      testnet: BITCOIN_API_BASE_URL_TESTNET,
      regtest: BITCOIN_API_BASE_URL_TESTNET,
      signet: BITCOIN_API_BASE_URL_TESTNET,
    });

    const bitcoinContractInterface = JsDLCInterface.new(
      bytesToHex(currentAddressPrivateKey),
      currentAddress,
      currentBitcoinNetwork,
      blockchainAPI,
      oracleAPI
    );

    return bitcoinContractInterface;
  }

  function handleOffer(
    bitcoinContractOfferJSON: string,
    counterpartyWalletURL: string,
    counterpartyWalletName: string,
    counterpartyWalletIcon: string
  ): BitcoinContractOfferDetails {
    const bitcoinContractOffer = JSON.parse(bitcoinContractOfferJSON);

    const bitcoinContractId = bitcoinContractOffer.temporaryContractId;
    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;
    const bitcoinContractExpirationDate = new Date(
      bitcoinContractOffer.cetLocktime * 1000
    ).toLocaleDateString();

    const simplifiedBitcoinContractOffer: SimplifiedBitcoinContract = {
      bitcoinContractId,
      bitcoinContractCollateralAmount,
      bitcoinContractExpirationDate,
    };

    const counterpartyWalletDetails: CounterpartyWalletDetails = {
      counterpartyWalletURL,
      counterpartyWalletName,
      counterpartyWalletIcon,
    };

    const bitcoinContractOfferDetails: BitcoinContractOfferDetails = {
      simplifiedBitcoinContract: simplifiedBitcoinContractOffer,
      counterpartyWalletDetails,
    };

    return bitcoinContractOfferDetails;
  }

  async function handleAccept(
    bitcoinContractJSON: string,
    counterpartyWalletDetails: CounterpartyWalletDetails
  ) {
    let bitcoinContractInterface: JsDLCInterface | undefined;
    try {
      bitcoinContractInterface = await getBitcoinContractInterface();
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with getting the bitcoin contract interface',
          body: 'Unable to setup interface',
        },
      });
      sendRpcResponse('none', '', 'failed');
    }

    if (!bitcoinContractInterface) return;

    const bitcoinContractOffer = JSON.parse(bitcoinContractJSON);

    const bitcoinContractId = bitcoinContractOffer.temporaryContractId;
    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;

    await bitcoinContractInterface.get_wallet_balance();

    try {
      const acceptedBitcoinContract = await bitcoinContractInterface.accept_offer(
        bitcoinContractJSON
      );

      const signedBitcoinContract = await sendAcceptedBitcoinContractOfferToProtocolWallet(
        acceptedBitcoinContract,
        counterpartyWalletDetails.counterpartyWalletURL
      );

      const txId = await bitcoinContractInterface.countersign_and_broadcast(
        JSON.stringify(signedBitcoinContract)
      );

      const { txMoney, txFiatValue, txFiatValueSymbol, txLink, symbol } = getTransactionDetails(
        txId,
        bitcoinContractCollateralAmount
      );

      navigate(RouteUrls.BitcoinContractLockSuccess, {
        state: {
          txId,
          txMoney,
          txFiatValue,
          txFiatValueSymbol,
          symbol,
          txLink,
        },
      });

      sendRpcResponse(bitcoinContractId, txId, 'accept');
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with your Bitcoin Contract',
          body: 'Unable to lock bitcoin',
        },
      });
      sendRpcResponse(bitcoinContractId, '', 'failed');
    }
  }

  function handleReject(bitcoinContractId: string) {
    sendRpcResponse(bitcoinContractId, '', 'reject');
    close();
  }

  function getTransactionDetails(txId: string, bitcoinCollateral: number) {
    const bitcoinValue = satToBtc(bitcoinCollateral);
    const txMoney = createMoneyFromDecimal(bitcoinValue, 'BTC');
    const txFiatValue = i18nFormatCurrency(calculateFiatValue(txMoney)).toString();
    const txFiatValueSymbol = bitcoinMarketData.price.symbol;
    const txLink = { blockchain: 'bitcoin', txid: txId };

    return {
      txId,
      txMoney,
      txFiatValue,
      txFiatValueSymbol,
      symbol: 'BTC',
      txLink,
    };
  }

  function sendRpcResponse(bitcoinContractId: string, txId: string, action: string) {
    if (!defaultParams.tabId || !initialSearchParams.get('requestId')) return;

    chrome.tabs.sendMessage(
      defaultParams.tabId,
      makeRpcSuccessResponse('acceptBitcoinContractOffer', {
        id: initialSearchParams.get('requestId') as string,
        result: {
          contractId: bitcoinContractId,
          txId,
          action,
        },
      })
    );
  }

  return {
    handleOffer,
    handleAccept,
    handleReject,
  };
}
