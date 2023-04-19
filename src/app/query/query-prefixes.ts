/**
 * These values are used as the first item in some query keys, allowing the
 * queries they are used in to be read from any part of the app.
 */
export enum QueryPrefixes {
  OrdinalTextContent = 'ordinal-text-content',
  TaprootAddressUtxosMetadata = 'taproot-address-utxos-metadata',
  InscriptionFromUtxo = 'inscription-from-utxo',
  BnsNamesByAddress = 'bns-names-by-address',
  InscriptionMetadata = 'inscription-metadata',
  InscriptionFromTxid = 'inscription-from-txid',
  GetNftMetadata = 'get-nft-metadata',

  StampCollection = 'stamp-collection',
}
