import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { JsDLCInterface } from 'dlc-wasm-wallet';

import { createMoneyFromDecimal  } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { CounterpartyWalletDetails } from '@app/pages/bitcoin-contract-request/bitcoin-contract-request';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountNativeSegwitDetails } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { initialSearchParams } from '../initial-search-params';
import { baseCurrencyAmountInQuote } from '../money/calculate-money';
import { i18nFormatCurrency } from '../money/format-money';
import { satToBtc } from '../money/unit-conversion';
import { useDefaultRequestParams } from './use-default-request-search-params';

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


  async function handleAccept(
    bitcoinContractJSON: string,
    counterpartyWalletDetails: CounterpartyWalletDetails
  ) {
    const { currentBitcoinNetwork, currentAddress, currentAddressIndexKeychain } =
      bitcoinAccountDetails ?? {};
    if (
      !currentBitcoinNetwork ||
      !currentAddress ||
      !currentAddressIndexKeychain ||
      !currentAddressIndexKeychain.privateKey
    )
      return;

    const privateKey = convertUint8ArrayToHexString(currentAddressIndexKeychain.privateKey);
    const blockchainAPI =
      currentBitcoinNetwork === 'mainnet'
        ? 'https://blockstream.info/api'
        : 'https://blockstream.info/testnet/api';
    const oracleAPI = 'https://testnet.dlc.link/oracle';

    const bitcoinContractInterface = await JsDLCInterface.new(
      privateKey,
      currentAddress,
      currentBitcoinNetwork,
      blockchainAPI,
      oracleAPI
    );

    const bitcoinContractOffer = JSON.parse(bitcoinContractJSON);

    const bitcoinContractID = bitcoinContractOffer.temporaryContractId;
    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;

    try {
      const acceptedBitcoinContract = await bitcoinContractInterface.accept_offer(
        bitcoinContractJSON
      );

      const signedBitcoinContract = await sendAcceptedBitcoinContractOfferToProtocolWallet(
        acceptedBitcoinContract,
        counterpartyWalletDetails.counterpartyWalletURL
      );

      const txID = await bitcoinContractInterface.countersign_and_broadcast(
        JSON.stringify(signedBitcoinContract)
      );

      const bitcoinCollateral = bitcoinContractCollateralAmount;
      const txValue = satToBtc(bitcoinCollateral).toString();
      const txFiatValue = getFiatValue(txValue);
      const txFiatValueSymbol = bitcoinMarketData.price.symbol;
      const txLink = {
        blockchain: 'bitcoin',
        txid: txID,
      };

      navigate(RouteUrls.BitcoinContractLockSuccess, {
        state: {
          txId: txID,
          txValue,
          txFiatValue,
          txFiatValueSymbol,
          symbol: 'BTC',
          txLink,
        },
      });

      if (!defaultParams.tabId || !initialSearchParams.get('requestID')) return;
      chrome.tabs.sendMessage(
        defaultParams.tabId,
        makeRpcSuccessResponse('acceptOffer', {
          id: initialSearchParams.get('requestID') as string,
          contractID: bitcoinContractID,
          txID: txID,
          action: 'broadcast',
        })
      );
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, { state: { error } });
      if (!defaultParams.tabId || !initialSearchParams.get('requestID')) return;
      chrome.tabs.sendMessage(
        defaultParams.tabId,
        makeRpcSuccessResponse('acceptOffer', {
          id: initialSearchParams.get('requestID') as string,
          contractID: bitcoinContractID,
          action: 'failed',
        })
      );
    }
  }

  async function handleReject(bitcoinContractID: string) {
    if (!defaultParams.tabId || !initialSearchParams.get('requestID')) return;
    chrome.tabs.sendMessage(
      defaultParams.tabId,
      makeRpcSuccessResponse('acceptOffer', {
        id: initialSearchParams.get('requestID') as string,
        contractID: bitcoinContractID,
        action: 'reject',
      })
    );
    close();
  }

  return {
    handleAccept,
    handleReject,
  };
};

export default useBitcoinContracts;
