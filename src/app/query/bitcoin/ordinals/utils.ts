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

/**
 * Inscriptions contain arbitrary data. When retrieving an inscription, it should be
 * classified into one of the types below, indicating that the app can handle it
 * appropriately and securely. Inscriptions of types not ready to be handled by the
 * app should be classified as "other".
 */
const supportedInscriptionTypes = ['image', 'text', 'other'] as const;

type SupportedInscriptionType = (typeof supportedInscriptionTypes)[number];

interface BaseInscriptionInfo {
  /**
   * The kind of inscription as classified by this app. Different kinds of inscriptions
   * require different treatment (e.g., images vs documents).
   */
  type: SupportedInscriptionType;
  title: string;
  infoUrl: string;
}

interface ImageInscriptionInfo extends BaseInscriptionInfo {
  type: 'image';
  src: string;
}

interface TextInscriptionInfo extends BaseInscriptionInfo {
  type: 'text';
  contentSrc: string;
}

interface OtherInscriptionInfo extends BaseInscriptionInfo {
  type: 'other';
}

/**
 * Information useful to the app about an inscription depending on its
 * type. Typically, API data will be used to construct this object. This is
 * *not* the result of any one API response.
 */
export type InscriptionInfo = ImageInscriptionInfo | TextInscriptionInfo | OtherInscriptionInfo;

export function createInfoUrl(contentPath: string) {
  return `https://ordinals.com${contentPath}`.replace('content', 'inscription');
}

export function whenInscriptionType<T>(
  mimeType: string,
  branches: { [k in SupportedInscriptionType]?: () => T }
) {
  if (mimeType.startsWith('image/') && branches.image) {
    return branches.image();
  }

  if (mimeType.startsWith('text') && branches.text) {
    return branches.text();
  }

  if (branches.other) return branches.other();

  throw new Error('Unhandled inscription type.');
}

// In lieu of reliable API, we scrape HTML from the Ordinals.com explorer and
// parses the HTML
// Example:
// https://ordinals.com/output/758bd2703dd9f0a2df31c2898aecf6caba05a906498c9bc076947f9fc4d8f081:0
async function getOrdinalsComTxOutputHtmlPage(id: string, index: number) {
  const resp = await fetch(`https://ordinals.com/output/${id}:${index}`);
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
