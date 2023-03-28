import { HDKey } from '@scure/bip32';

import { NetworkModes } from '@shared/constants';
import { deriveAddressIndexKeychainFromAccount } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootPayment } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { DerivationPathDepth } from '@shared/crypto/derivation-path.utils';

export function hasInscriptions(data: unknown[]) {
  return data.length !== 0;
}

interface GetTaprootAddressArgs {
  index: number;
  keychain?: HDKey;
  network: NetworkModes;
}
export function getTaprootAddress({ index, keychain, network }: GetTaprootAddressArgs) {
  if (!keychain) throw new Error('Expected keychain to be provided');
  if (keychain.depth !== DerivationPathDepth.Account)
    throw new Error('Expects keychain to be on the account index');

  const addressIndex = deriveAddressIndexKeychainFromAccount(keychain)(index);

  if (!addressIndex.privateKey) {
    throw new Error('Expected privateKey to be defined');
  }

  const payment = getTaprootPayment(addressIndex.publicKey!, network);

  if (!payment.address) throw new Error('Expected address to be defined');

  return payment.address;
}

// In lieu of reliable API, we scrape HTML from the Ordinals.com explorer and
// parses the HTML
// Example:
// https://ordinals.com/output/758bd2703dd9f0a2df31c2898aecf6caba05a906498c9bc076947f9fc4d8f081:0
async function getOrdinalsComTxOutputHtmlPage(id: string, index: number) {
  const resp = await fetch(`https://ord.ordscan.xyz/output/${id}:${index}`);
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

export async function getNumberOfInscriptionOnUtxo(id: string, index: number) {
  const utxoPage = await getOrdinalsComTxOutputHtmlPage(id, index);

  // First content on page is inscrption section header and thumbnail of
  // inscrptions in utxo
  const firstSectionHeader = utxoPage.querySelector('dl > dt:first-child');
  if (!firstSectionHeader)
    throw new Error('If no element matching this selector is found, something is wrong');

  const firstHeaderText = firstSectionHeader.textContent;
  const thumbnailCount = utxoPage.querySelectorAll('dl > dt:first-child + dd.thumbnails a').length;

  // Were HTML to page to change, thumbnailCount alone would dangerously return
  // zero 0, hence additional check that inscrption header is also missing
  if (thumbnailCount === 0 && firstHeaderText !== 'inscriptions') return 0;

  return thumbnailCount;
}
