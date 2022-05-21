export const NetworkSelectors = {
  NetworkName: 'network-name',
  NetworkAddress: 'network-address',
  NetworkKey: 'network-key',
  BtnAddNetwork: 'btn-add-network',
  ErrorText: 'error-text',
  APINetwork: process.env.APIEnvVariable || 'https://stacks-node-api-inactive.stacks.co/',
  EmptyAddressError: 'Please enter a valid URL',
  NoNodeFetch: 'Unable to fetch info from node.',
};
