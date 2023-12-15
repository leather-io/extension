/**
 * These values are used as the first item in some query keys, allowing the
 * queries they are used in to be read from any part of the app.
 */
export enum QueryPrefixes {
  Brc20TokenBalance = 'brc20-token-balance',
  OrdinalTextContent = 'ordinal-text-content',
  TaprootAddressUtxos = 'taproot-address-utxos',
  BnsNamesByAddress = 'bns-names-by-address',
  InscriptionsByAddress = 'inscriptions-by-address',
  InscriptionMetadata = 'inscription-metadata',
  GetInscriptions = 'get-inscriptions',
  GetNftMetadata = 'get-nft-metadata',
  GetNftHoldings = 'get-nft-holdings',

  StampCollection = 'stamp-collection',
  StampsByAddress = 'stamps-by-address',
  GetBrc20Tokens = 'get-brc20-tokens',
}
