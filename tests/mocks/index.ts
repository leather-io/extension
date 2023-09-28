import { HIRO_API_BASE_URL_MAINNET, HIRO_API_BASE_URL_TESTNET } from '@shared/constants';

export const SECRET_KEY =
  'invite helmet save lion indicate chuckle world pride afford hard broom draft';

export const HEYSTACK_HEY_TX_REQUEST =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdHhBZGRyZXNzIjoiU1QyUEhDUEFOVlQ4RFZQU1k1VzJaWjgxTTI4NVE1WjhZNkRRTVpFN1oiLCJjb250cmFjdEFkZHJlc3MiOiJTVDIxRlRDODJDQ0tFMFlIOVNLNVNKMUQ0WEVNUkEwNjlGS1YwVko4TiIsImNvbnRyYWN0TmFtZSI6ImhleS1maW5hbCIsImZ1bmN0aW9uTmFtZSI6InNlbmQtbWVzc2FnZSIsInBvc3RDb25kaXRpb25zIjpbIjAxMDIxYWFkMTY1OTU1ZGU5MGRkZGIzZTJmMDVmZmEwMzQxMjBiNzJmZDFlMzMxYTgyZmQzMTAyNjMyNmUwN2EyOWNjY2I5OTA1YTRlYmE5ODUwMGM5N2MwOTY4NjU3OTJkNzQ2ZjZiNjU2ZTA5Njg2NTc5MmQ3NDZmNmI2NTZlMDEwMDAwMDAwMDAwMDAwMDAxIl0sIm5ldHdvcmsiOnsidmVyc2lvbiI6MTI4LCJjaGFpbklkIjoyMTQ3NDgzNjQ4LCJjb3JlQXBpVXJsIjoiaHR0cHM6Ly9zdGFja3Mtbm9kZS1hcGkudGVzdG5ldC5zdGFja3MuY28iLCJibnNMb29rdXBVcmwiOiJodHRwczovL3N0YWNrcy1ub2RlLWFwaS5tYWlubmV0LnN0YWNrcy5jbyIsImJyb2FkY2FzdEVuZHBvaW50IjoiL3YyL3RyYW5zYWN0aW9ucyIsInRyYW5zZmVyRmVlRXN0aW1hdGVFbmRwb2ludCI6Ii92Mi9mZWVzL3RyYW5zZmVyIiwiYWNjb3VudEVuZHBvaW50IjoiL3YyL2FjY291bnRzIiwiY29udHJhY3RBYmlFbmRwb2ludCI6Ii92Mi9jb250cmFjdHMvaW50ZXJmYWNlIiwicmVhZE9ubHlGdW5jdGlvbkNhbGxFbmRwb2ludCI6Ii92Mi9jb250cmFjdHMvY2FsbC1yZWFkIn0sImZ1bmN0aW9uQXJncyI6WyIwZTAwMDAwMDE1Njg2NTc5MjA2NjcyNmY2ZDIwNzQ2ODY1MjA3NDY1NzM3NDIwNjE3MDcwIiwiMGEwZTAwMDAwMDdlNjg3NDc0NzA3MzNhMmYyZjZkNjU2NDY5NjEzMTJlNjc2OTcwNjg3OTJlNjM2ZjZkMmY2ZDY1NjQ2OTYxMmY0MTUzNjQzMDU1NmI2YTMwNzkzMzcxNGQ0ZDJmNjc2OTcwNjg3OTJlNjc2OTY2M2Y2MzY5NjQzZDMyMzkzODM1NjQ2NTYyNjIzMDc4MzQzMzZkMzQ3NjM0NjE3YTc3NjM3NTM5NzE2NzM0NmY2NjY0NjQ3OTc5MzA2OTY0NjI2YTZkNjk2ZDczN2E2ZjM2MzIzODMxNjc2YTI2NzI2OTY0M2Q2NzY5NzA2ODc5MmU2NzY5NjYyNjYzNzQzZDY3Il0sInR4VHlwZSI6ImNvbnRyYWN0X2NhbGwiLCJwdWJsaWNLZXkiOiIwMzFhNWQ1ZmIzNjQ1Yzc2YzUwODNlM2E0ZmI5YTU5YjVmZWQzMDljODcxOTc4NDcxZDY0NDhjOGFkZTg2MzgwZTgiLCJhcHBEZXRhaWxzIjp7Im5hbWUiOiJIZXlzdGFjayIsImljb24iOiIvaWNvbi5wbmcifX0.ik9kZfTDIfgaCDi6MgGwcWMB7Gi7PbY2q8lMupzxIJ0FqLA6uLBy0n2BjQDqN6dHM5M6a_RKvnM8R-RON60QsA';

export const HEYSTACK_HEY_TX_REQUEST_DECODED = {
  stxAddress: 'ST2PHCPANVT8DVPSY5W2ZZ81M285Q5Z8Y6DQMZE7Z',
  contractAddress: 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N',
  contractName: 'hey-final',
  functionName: 'send-message',
  postConditions: [
    '01021aad165955de90dddb3e2f05ffa034120b72fd1e331a82fd31026326e07a29cccb9905a4eba98500c97c096865792d746f6b656e096865792d746f6b656e010000000000000001',
  ],
  network: {
    version: 128,
    chainId: 2147483648,
    coreApiUrl: HIRO_API_BASE_URL_TESTNET,
    bnsLookupUrl: HIRO_API_BASE_URL_MAINNET,
    broadcastEndpoint: '/v2/transactions',
    transferFeeEstimateEndpoint: '/v2/fees/transfer',
    accountEndpoint: '/v2/accounts',
    contractAbiEndpoint: '/v2/contracts/interface',
    readOnlyFunctionCallEndpoint: '/v2/contracts/call-read',
  },
  functionArgs: [
    '0e000000156865792066726f6d20746865207465737420617070',
    '0a0e0000007e68747470733a2f2f6d65646961312e67697068792e636f6d2f6d656469612f41536430556b6a307933714d4d2f67697068792e6769663f6369643d3239383564656262307834336d347634617a776375397167346f6664647979306964626a6d696d737a6f36323831676a267269643d67697068792e6769662663743d67',
  ],
  txType: 'contract_call',
  publicKey: '031a5d5fb3645c76c5083e3a4fb9a59b5fed309c871978471d6448c8ade86380e8',
  appDetails: {
    name: 'Heystack',
    icon: '/icon.png',
  },
};

// ts-unused-exports:disable-next-line
export const STX_TRANSFER_DECODED = {
  stxAddress: 'ST35Z3YQCTC1WZ8Z7AKHGE91HK05WKMKPTN1KX7Q7',
  network: {
    version: 128,
    chainId: 2147483648,
    coreApiUrl: 'https://stacks-node-api.xenon.blockstack.org',
    bnsLookupUrl: 'https://core.blockstack.org',
    broadcastEndpoint: '/v2/transactions',
    transferFeeEstimateEndpoint: '/v2/fees/transfer',
    accountEndpoint: '/v2/accounts',
    contractAbiEndpoint: '/v2/contracts/interface',
    readOnlyFunctionCallEndpoint: '/v2/contracts/call-read',
  },
  authOrigin: 'http://localhost:8080',
  memo: 'From demo app',
  recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
  amount: '102',
  publicKey: '02c67e6eec3c66368057320e631cff03f1f369228d24379f358a0ae8ff942e4eff',
  txType: 'token_transfer',
  appDetails: { name: 'Testing App', icon: '/assets/messenger-app-icon.png' },
} as const;
