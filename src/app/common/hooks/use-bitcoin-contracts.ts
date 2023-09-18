import { useNavigate } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import { JsDLCInterface } from '@dlc-link/dlc-tools';
import { bytesToHex } from '@stacks/common';

import {
  deriveAddressIndexKeychainFromAccount,
  extractAddressIndexFromPath,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import { Money, createMoneyFromDecimal } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import { checkDlcLinkAttestorHealth } from '@app/query/bitcoin/contract/check-dlc-link-attestor-health';
import { sendAcceptedBitcoinContractOfferToProtocolWallet } from '@app/query/bitcoin/contract/send-accepted-bitcoin-contract-offer';
import {
  useCalculateBitcoinFiatValue,
  useCryptoCurrencyMarketData,
} from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import {
  useCurrentAccountNativeSegwitIndexZeroSigner,
  useNativeSegwitAccountBuilder,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { initialSearchParams } from '../initial-search-params';
import { i18nFormatCurrency } from '../money/format-money';
import { satToBtc } from '../money/unit-conversion';
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
  const bitcoinMarketData = useCryptoCurrencyMarketData('BTC');
  const calculateFiatValue = useCalculateBitcoinFiatValue();
  const bitcoinAccountDetails = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentIndex = useCurrentAccountIndex();
  const nativeSegwitPrivateKeychain = useNativeSegwitAccountBuilder()?.(currentIndex);
  const currentBitcoinNetwork = useCurrentNetwork();

  async function getBitcoinContractInterface(
    attestorURLs: string[]
  ): Promise<JsDLCInterface | undefined> {
    if (!nativeSegwitPrivateKeychain || !bitcoinAccountDetails) return;

    const currentAddress = bitcoinAccountDetails.address;
    const currentAccountIndex = extractAddressIndexFromPath(bitcoinAccountDetails.derivationPath);

    const currentAddressPrivateKey = deriveAddressIndexKeychainFromAccount(
      nativeSegwitPrivateKeychain.keychain
    )(currentAccountIndex).privateKey;

    if (!currentAddressPrivateKey) return;

    const bitcoinContractInterface = await JsDLCInterface.new(
      bytesToHex(currentAddressPrivateKey),
      currentAddress,
      currentBitcoinNetwork.chain.bitcoin.network,
      currentBitcoinNetwork.chain.bitcoin.url,
      JSON.stringify(attestorURLs)
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
    const bitcoinContractExpirationDate = new Date(
      bitcoinContractOffer.cetLocktime * 1000
    ).toLocaleDateString();

    const simplifiedBitcoinContractOffer: SimplifiedBitcoinContract = {
      bitcoinContractId,
      bitcoinContractCollateralAmount,
      bitcoinContractExpirationDate,
    };

    const bitcoinContractOfferDetails: BitcoinContractOfferDetails = {
      simplifiedBitcoinContract: simplifiedBitcoinContractOffer,
      counterpartyWalletDetails,
    };

    return bitcoinContractOfferDetails;
  }

  async function handleAccept(
    bitcoinContractJSON: string,
    counterpartyWalletDetails: CounterpartyWalletDetails,
    attestorURLs: string[]
  ) {
    let bitcoinContractInterface: JsDLCInterface | undefined;
    try {
      bitcoinContractInterface = await getBitcoinContractInterface(attestorURLs);
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

    await bitcoinContractInterface.get_wallet_balance();

    try {
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

  async function getHealthyDlcLinkAttestor(): Promise<string> {
    const dlcLinkAttestorUrls = [
      'https://devnet.dlc.link/attestor-1/',
      'https://devnet.dlc.link/attestor-2/',
      'https://devnet.dlc.link/attestor-3/',
    ];

    let currentAttestorUrl: string | undefined;

    for (const attestorURL of dlcLinkAttestorUrls) {
      const isAttestorHealthy = await checkDlcLinkAttestorHealth(attestorURL);
      if (isAttestorHealthy) {
        currentAttestorUrl = attestorURL;
        break;
      }
    }

    if (!currentAttestorUrl) {
      throw new Error('Unable to find a healthy DLC.Link attestor');
    }

    return currentAttestorUrl;
  }

  async function getAllSignedBitcoinContracts() {
    let bitcoinContractInterface: JsDLCInterface | undefined;

    try {
      const currentAttestorUrl = await getHealthyDlcLinkAttestor();
      bitcoinContractInterface = await getBitcoinContractInterface([currentAttestorUrl]);
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

    const bitcoinContracts = await bitcoinContractInterface.get_contracts();
    const signedBitcoinContracts = bitcoinContracts.filter(
      (bitcoinContract: BitcoinContractListItem) => bitcoinContract.state === 'Signed'
    );

    return signedBitcoinContracts;
  }

  function getTransactionDetails(txId: string, bitcoinCollateral: number) {
    const bitcoinValue = satToBtc(bitcoinCollateral);
    const txMoney = createMoneyFromDecimal(bitcoinValue, 'BTC');
    const txFiatValue = i18nFormatCurrency(calculateFiatValue(txMoney)).toString();
    const txFiatValueSymbol = bitcoinMarketData.price.symbol;
    const txLink = { blockchain: 'bitcoin', txId };

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
    const bitcoinContracts = await getAllSignedBitcoinContracts();
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
    getAllSignedBitcoinContracts,
    sumBitcoinContractCollateralAmounts,
    sendRpcResponse,
  };
}
