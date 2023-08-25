import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { BitcoinContractOfferDetails } from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { BitcoinContractOfferDetailsSimple } from './components/bitcoin-contract-offer/bitcoin-contract-offer-details';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request-layout';
import { BitcoinContractRequestWarningLabel } from './components/bitcoin-contract-request-warning-label';

export function BitcoinContractRequest() {
  const getNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const navigate = useNavigate();

  const { handleOffer, handleAccept, handleReject, sendRpcResponse } = useBitcoinContracts();

  const [bitcoinContractJSON, setBitcoinContractJSON] = useState<string>();
  const [bitcoinContractOfferDetails, setBitcoinContractOfferDetails] =
    useState<BitcoinContractOfferDetails>();
  const [bitcoinAddress, setBitcoinAddress] = useState<string>();
  const [attestorURLs, setAttestorURLs] = useState<string[]>([]);

  const [isLoading, setLoading] = useState(true);
  const [isProcessing, setProcessing] = useState(false);

  const handleAcceptClick = async () => {
    if (!bitcoinContractJSON || !bitcoinContractOfferDetails) return;
    setProcessing(true);
    await handleAccept(
      bitcoinContractJSON,
      bitcoinContractOfferDetails.counterpartyWalletDetails,
      attestorURLs
    );
    setProcessing(false);
  };

  const handleRejectClick = async () => {
    if (!bitcoinContractOfferDetails) return;
    handleReject();
  };

  useOnMount(() => {
    const bitcoinContractOfferJSON = initialSearchParams.get('bitcoinContractOffer');
    const counterpartyWalletDetailsJSON = initialSearchParams.get('counterpartyWalletDetails');
    const attestorURLs = initialSearchParams.get('attestorURLs');

    const bitcoinAccountDetails = getNativeSegwitSigner?.(0);

    if (!bitcoinAccountDetails) return;

    const currentBitcoinNetwork = bitcoinAccountDetails.network;

    if (currentBitcoinNetwork !== 'testnet') {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error: new Error('Invalid Network'),
          title: "Network doesn't support Bitcoin Contracts",
          body: "The wallet's current selected network doesn't support Bitcoin Contracts",
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.NETWORK_ERROR);
    }

    if (
      !getNativeSegwitSigner ||
      !bitcoinContractOfferJSON ||
      !counterpartyWalletDetailsJSON ||
      !attestorURLs
    )
      return;

    const currentBitcoinContractOfferDetails = handleOffer(
      bitcoinContractOfferJSON,
      counterpartyWalletDetailsJSON
    );

    const currentAddress = getNativeSegwitSigner(0).address;

    setBitcoinContractJSON(bitcoinContractOfferJSON);
    setBitcoinContractOfferDetails(currentBitcoinContractOfferDetails);
    setBitcoinAddress(currentAddress);
    setAttestorURLs(JSON.parse(attestorURLs));
    setLoading(false);
  });

  return (
    <>
      {!isLoading && bitcoinAddress && bitcoinContractOfferDetails && (
        <BitcoinContractRequestLayout>
          <BitcoinContractRequestHeader
            counterpartyWalletName={
              bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletName
            }
            counterpartyWalletIcon={
              bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletIcon
            }
          />
          <BitcoinContractRequestWarningLabel
            appName={bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletName}
          />
          <BitcoinContractRequestActions
            isLoading={isProcessing}
            bitcoinAddress={bitcoinAddress}
            requiredAmount={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinContractCollateralAmount
            }
            onRejectBitcoinContractOffer={handleRejectClick}
            onAcceptBitcoinContractOffer={handleAcceptClick}
          />
          <BitcoinContractOfferDetailsSimple
            bitcoinAddress={bitcoinAddress}
            bitcoinContractOffer={bitcoinContractOfferDetails.simplifiedBitcoinContract}
          />
        </BitcoinContractRequestLayout>
      )}
    </>
  );
}
