import { useNavigate } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import { JsDLCInterface } from '@dlc-link/dlc-tools';
import { bytesToHex } from '@stacks/common';

import { deriveAddressIndexKeychainFromAccount } from '@leather-wallet/bitcoin';
import { extractAddressIndexFromPath } from '@leather-wallet/crypto';
import type { Money } from '@leather-wallet/models';
import {
  sendAcceptedBitcoinContractOfferToProtocolWallet,
  useCalculateBitcoinFiatValue,
  useCryptoCurrencyMarketDataMeanAverage,
} from '@leather-wallet/query';
import { createMoneyFromDecimal, i18nFormatCurrency, satToBtc } from '@leather-wallet/utils';

import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';
import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useCurrentAccountIndex } from '@app/store/accounts/account';
import {
  useCurrentAccountNativeSegwitIndexZeroSigner,
  useNativeSegwitAccountBuilder,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { initialSearchParams } from '../initial-search-params';
import { useDefaultRequestParams } from './use-default-request-search-params';

export interface SimplifiedBitcoinContract {
  bitcoinContractId: string;
  bitcoinContractCollateralAmount: number;
  bitcoinContractEmergencyRefundTime: string;
}

interface CounterpartyWalletDetails {
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
}

export interface BitcoinContractListItem {
  id: string;
  state: string;
  acceptorCollateral: string;
  txId: string;
}

export interface BitcoinContractOfferDetails {
  simplifiedBitcoinContract: SimplifiedBitcoinContract;
  counterpartyWalletDetails: CounterpartyWalletDetails;
}

export function useBitcoinContracts() {
  const navigate = useNavigate();
  const defaultParams = useDefaultRequestParams();
  const bitcoinMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const calculateFiatValue = useCalculateBitcoinFiatValue();

  const bitcoinAccountDetails = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentIndex = useCurrentAccountIndex();
  const nativeSegwitPrivateKeychain = useNativeSegwitAccountBuilder()?.(currentIndex);
  const currentNetwork = useCurrentNetwork();

  async function getBitcoinContractInterface(): Promise<JsDLCInterface | undefined> {
    if (!nativeSegwitPrivateKeychain || !bitcoinAccountDetails) return;

    const currentAddress = bitcoinAccountDetails.address;
    const currentAccountIndex = extractAddressIndexFromPath(bitcoinAccountDetails.derivationPath);
    const currentBitcoinNetwork = currentNetwork.chain.bitcoin;

    const currentAddressPrivateKey = deriveAddressIndexKeychainFromAccount(
      nativeSegwitPrivateKeychain.keychain
    )(currentAccountIndex).privateKey;

    if (!currentAddressPrivateKey) return;

    if (
      currentBitcoinNetwork.bitcoinNetwork === 'mainnet' ||
      currentBitcoinNetwork.bitcoinNetwork === 'signet'
    )
      return;

    const bitcoinContractStorageMap: Record<'testnet' | 'regtest', string> = {
      testnet: 'https://testnet.dlc.link/storage-api',
      regtest: 'https://devnet.dlc.link/storage-api',
    };
    const bitcoinContractStorageApiUrl =
      bitcoinContractStorageMap[currentBitcoinNetwork.bitcoinNetwork];

    const bitcoinContractInterface = await JsDLCInterface.new(
      bytesToHex(currentAddressPrivateKey),
      currentAddress,
      currentBitcoinNetwork.bitcoinNetwork,
      currentBitcoinNetwork.bitcoinUrl,
      bitcoinContractStorageApiUrl
    );

    return bitcoinContractInterface;
  }

  function handleOffer(
    bitcoinContractOfferJSON: string,
    counterpartyWalletDetailsJSON: string
  ): BitcoinContractOfferDetails {
    const bitcoinContractOffer = JSON.parse(bitcoinContractOfferJSON);
    const counterpartyWalletDetails = JSON.parse(counterpartyWalletDetailsJSON);

    const bitcoinContractId = bitcoinContractOffer.temporaryContractId;
    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;
    const bitcoinContractEmergencyRefundTime = new Date(
      bitcoinContractOffer.refundLocktime * 1000
    ).toLocaleDateString();

    const simplifiedBitcoinContractOffer: SimplifiedBitcoinContract = {
      bitcoinContractId,
      bitcoinContractCollateralAmount,
      bitcoinContractEmergencyRefundTime,
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
          title: 'There was an error with getting the Bitcoin Contract Interface',
          body: 'Unable to setup Bitcoin Contract Interface',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.INTERFACE_ERROR);
    }

    if (!bitcoinContractInterface) return;

    const bitcoinContractOffer = JSON.parse(bitcoinContractJSON);

    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;

    try {
      await bitcoinContractInterface.get_wallet_balance();

      const acceptedBitcoinContract =
        await bitcoinContractInterface.accept_offer(bitcoinContractJSON);

      const signedBitcoinContract = await sendAcceptedBitcoinContractOfferToProtocolWallet(
        acceptedBitcoinContract,
        counterpartyWalletDetails.counterpartyWalletURL
      );

      const bitcoinContractId = signedBitcoinContract.contractId;

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

      sendRpcResponse(BitcoinContractResponseStatus.SUCCESS, bitcoinContractId, txId);
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with your Bitcoin Contract',
          body: 'Unable to lock bitcoin',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.BROADCAST_ERROR);
    }
  }

  function handleReject() {
    sendRpcResponse(BitcoinContractResponseStatus.REJECTED);
    close();
  }

  async function getAllActiveBitcoinContracts(): Promise<BitcoinContractListItem[] | undefined> {
    const bitcoinContractInterface = await getBitcoinContractInterface();

    if (!bitcoinContractInterface) return;

    await bitcoinContractInterface.periodic_check();
    const bitcoinContracts = await bitcoinContractInterface.get_contracts();

    const stateOrder = ['Signed', 'Confirmed'];

    const activeBitcoinContracts = bitcoinContracts
      .filter(
        (bitcoinContract: BitcoinContractListItem) =>
          bitcoinContract.state === 'Signed' || bitcoinContract.state === 'Confirmed'
      )
      .sort(
        (a: BitcoinContractListItem, b: BitcoinContractListItem) =>
          stateOrder.indexOf(a.state) - stateOrder.indexOf(b.state)
      );

    return activeBitcoinContracts;
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

  async function sumBitcoinContractCollateralAmounts(): Promise<Money> {
    let bitcoinContractsCollateralSum = 0;
    const bitcoinContracts = await getAllActiveBitcoinContracts();
    if (!bitcoinContracts) return createMoneyFromDecimal(0, 'BTC');

    bitcoinContracts.forEach((bitcoinContract: BitcoinContractListItem) => {
      bitcoinContractsCollateralSum += parseInt(bitcoinContract.acceptorCollateral);
    });
    const bitcoinContractCollateralSumMoney = createMoneyFromDecimal(
      satToBtc(bitcoinContractsCollateralSum),
      'BTC'
    );

    return bitcoinContractCollateralSumMoney;
  }

  function sendRpcResponse(
    responseStatus: BitcoinContractResponseStatus,
    bitcoinContractId?: string,
    txId?: string
  ) {
    if (!defaultParams.tabId || !initialSearchParams.get('requestId')) return;

    const requestId = initialSearchParams.get('requestId') as string;
    let response;

    switch (responseStatus) {
      case BitcoinContractResponseStatus.REJECTED:
        response = makeRpcErrorResponse('acceptBitcoinContractOffer', {
          id: requestId,
          error: {
            code: RpcErrorCode.USER_REJECTION,
            message: responseStatus,
          },
        });
        break;

      case BitcoinContractResponseStatus.NETWORK_ERROR:
        response = makeRpcErrorResponse('acceptBitcoinContractOffer', {
          id: requestId,
          error: {
            code: RpcErrorCode.INVALID_REQUEST,
            message: responseStatus,
          },
        });
        break;

      case BitcoinContractResponseStatus.BROADCAST_ERROR:
      case BitcoinContractResponseStatus.INTERFACE_ERROR:
        response = makeRpcErrorResponse('acceptBitcoinContractOffer', {
          id: requestId,
          error: {
            code: RpcErrorCode.INTERNAL_ERROR,
            message: responseStatus,
          },
        });
        break;

      default:
        response = makeRpcSuccessResponse('acceptBitcoinContractOffer', {
          id: requestId,
          result: {
            contractId: bitcoinContractId,
            txId,
          },
        });
        break;
    }

    chrome.tabs.sendMessage(defaultParams.tabId, response);
  }

  return {
    handleOffer,
    handleAccept,
    handleReject,
    getAllActiveBitcoinContracts,
    sumBitcoinContractCollateralAmounts,
    sendRpcResponse,
  };
}
