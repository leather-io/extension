import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import { JsDLCInterface } from 'dlc-wasm-wallet';

import { BitcoinCryptoCurrencyAssetBalance } from '@shared/models/crypto-asset-balance.model';
import { BitcoinCryptoCurrencyAsset } from '@shared/models/crypto-asset.model';
import { createMoneyFromDecimal, currencyDecimalsMap } from '@shared/models/money.model';
import { Money } from '@shared/models/money.model';
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

  async function getAllContracts() {
    if (!bitcoinAccountDetails) return;

    const { currentNetwork, currentAddress, currentAddressIndexKeychain } = bitcoinAccountDetails;
    const network = currentNetwork.chain.bitcoin.network;
    const privateKey = convertUint8ArrayToHexString(currentAddressIndexKeychain.privateKey!);
    const blockchainAPI =
      network === 'mainnet'
        ? 'https://blockstream.info/api'
        : 'https://blockstream.info/testnet/api';
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
    const blockchainAPI =
      network === 'mainnet'
        ? 'https://blockstream.info/api'
        : 'https://blockstream.info/testnet/api';
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
    const { currentNetwork, currentAddress, currentAddressIndexKeychain } =
      bitcoinAccountDetails ?? {};
    if (
      !currentNetwork ||
      !currentAddress ||
      !currentAddressIndexKeychain ||
      !currentAddressIndexKeychain.privateKey
    )
      return;
    const bitcoinContractOffer = JSON.parse(bitcoinContractJSON);

    const bitcoinContractID = bitcoinContractOffer.temporaryContractId;
    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;

    const network = currentNetwork.chain.bitcoin.network;
    const privateKey = convertUint8ArrayToHexString(currentAddressIndexKeychain.privateKey);
    const blockchainAPI =
      network === 'mainnet'
        ? 'https://blockstream.info/api'
        : 'https://blockstream.info/testnet/api';
    const oracleAPI = 'https://testnet.dlc.link/oracle';

    const bitcoinContractInterface = await JsDLCInterface.new(
      privateKey,
      currentAddress,
      network,
      blockchainAPI,
      oracleAPI
    );

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

  async function handleLockedBitcoinBalance() {
    let lockedBitcoins = 0;
    const allContracts: any[] = await getAllContracts();

    for (const contract of allContracts) {
      if (contract.state === 'Broadcasted') {
        lockedBitcoins += contract.contractInfo.totalCollateral;
      }
    }

    const lockedBitcoinBalanceInFiat = getFiatValue(lockedBitcoins.toString());
    const lockedBitcoinBalanceBigNumber = new BigNumber(lockedBitcoins);
    const lockedBitcoinBalanceMoney: Money = {
      amount: lockedBitcoinBalanceBigNumber,
      decimals: currencyDecimalsMap.BTC,
      symbol: 'BTC',
    };
    const asset: BitcoinCryptoCurrencyAsset = {
      decimals: 0,
      hasMemo: false,
      name: 'Locked Bitcoin',
      symbol: 'BTC',
    };

    const lockedBitcoinBalance: BitcoinCryptoCurrencyAssetBalance = {
      blockchain: 'bitcoin',
      type: 'crypto-currency',
      asset: asset,
      balance: lockedBitcoinBalanceMoney,
    };

    return { lockedBitcoinBalanceInFiat, lockedBitcoinBalance };
  }

  const initialLockedBitcoinBalance = {
    lockedBitcoinBalanceInFiat: getFiatValue('0'),
    lockedBitcoinBalance: {
      blockchain: 'bitcoin',
      type: 'crypto-currency',
      asset: {
        decimals: 0,
        hasMemo: false,
        name: 'Locked Bitcoin',
        symbol: 'BTC',
      },
      balance: {
        amount: new BigNumber(0),
        decimals: currencyDecimalsMap.BTC,
        symbol: 'BTC',
      },
    },
  };

  return {
    getAllContracts,
    getContract,
    handleAccept,
    handleReject,
    handleLockedBitcoinBalance,
    initialLockedBitcoinBalance,
  };
};

export default useBitcoinContracts;
