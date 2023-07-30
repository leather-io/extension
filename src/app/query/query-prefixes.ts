/**
 * These values are used as the first item in some query keys, allowing the
 * queries they are used in to be read from any part of the app.
 */
export enum QueryPrefixes {
  Brc20TokenBalance = 'brc20-token-balance',
  OrdinalTextContent = 'ordinal-text-content',
  TaprootAddressUtxosMetadata = 'taproot-address-utxos-metadata',
  InscriptionFromUtxo = 'inscription-from-utxo',
  BnsNamesByAddress = 'bns-names-by-address',
  InscriptionsByAddress = 'inscriptions-by-address',
  InscriptionMetadata = 'inscription-metadata',
  InscriptionFromTxid = 'inscription-from-txid',
  InscriptionsFromApiInfiniteQuery = 'inscriptions-from-api-infinite-query',
  GetNftMetadata = 'get-nft-metadata',
  GetNftHoldings = 'get-nft-holdings',

  StampCollection = 'stamp-collection',
  StampsByAddress = 'stamps-by-address',
  Brc20InfiniteQuery = 'brc20-infinite-query',
}
