export enum NetworkSelectors {
  NetworkListActiveNetwork = 'network-active-network',
  NetworkPageReady = 'network-page-ready',
  NetworkName = 'network-name',
  NetworkStacksAddress = 'network-stacks-address',
  NetworkBitcoinAddress = 'network-bitcoin-address',
  NetworkKey = 'network-key',
  ErrorText = 'error-text',
  EmptyNameError = 'Enter a name',
  EmptyStacksAddressError = 'Enter a valid Stacks API URL',
  EmptyBitcoinURLError = 'Enter a valid Bitcoin API URL',
  EmptyKeyError = 'Enter a unique key',
  NoStacksNodeFetch = 'Unable to fetch info from stacks node',
  NoBitcoinNodeFetch = 'Unable to fetch mempool from bitcoin node',

  // add network form
  AddNetworkBtn = 'add-network-btn',
  AddNetworkBitcoinAPISelector = 'add-network-bitcoin-api-selector',
  BitcoinApiOptionTestnet = 'bitcoin-api-option-testnet3',

  NetworkMenuBtn = 'network-menu-btn',
  EditNetworkMenuBtn = 'edit-network-menu-btn',
  DeleteNetworkMenuBtn = 'delete-network-menu-btn',
}
