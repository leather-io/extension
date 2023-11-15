export async function sendAcceptedBitcoinContractOfferToProtocolWallet(
  acceptedBitcoinContractOffer: string,
  counterpartyWalletURL: string
) {
  // TODO: refactor to use `axios`
  // https://github.com/leather-wallet/extension/issues/4521
  // eslint-disable-next-line no-restricted-globals
  const response = await fetch(`${counterpartyWalletURL}/offer/accept`, {
    method: 'put',
    body: JSON.stringify({
      acceptMessage: acceptedBitcoinContractOffer,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('The counterparty was unable to process the Bitcoin Contract.');
  }

  return response.json();
}
