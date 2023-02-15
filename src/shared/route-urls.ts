export enum RouteUrls {
  Container = '/',

  // Onboarding routes
  Onboarding = '/get-started',
  BackUpSecretKey = '/back-up-secret-key',
  SetPassword = '/set-password',
  SignIn = '/sign-in',
  MagicRecoveryCode = '/recovery-code',
  RequestDiagnostics = '/request-diagnostics',

  // Ledger routes
  ConnectLedger = 'connect-your-ledger',
  ConnectLedgerError = 'ledger-connection-error',
  ConnectLedgerSuccess = 'successfully-connected-your-ledger',
  DeviceBusy = 'please-wait',
  AwaitingDeviceUserAction = 'awaiting-approval',
  LedgerDisconnected = 'your-ledger-disconnected',
  LedgerOperationRejected = 'action-rejected',
  LedgerPublicKeyMismatch = 'wrong-ledger-device',
  LedgerDevicePayloadInvalid = 'ledger-payload-invalid',
  LedgerUnsupportedBrowser = 'unsupported-browser',
  LedgerOutdatedAppWarning = 'outdated-app-warning',

  // Active wallet routes
  Home = '/',
  AddNetwork = '/add-network',
  ChooseAccount = '/choose-account',
  Fund = '/fund',
  FundReceive = '/fund/receive',
  FundReceiveStx = '/fund/receive/stx',
  FundReceiveBtc = '/fund/receive/btc',
  IncreaseFee = '/increase-fee',
  Receive = '/receive',
  ReceiveStx = '/receive/stx',
  ReceiveBtc = '/receive/btc',
  Send = '/send-transaction',

  TransactionRequest = '/transaction',
  TransactionBroadcastError = 'broadcast-error',
  UnauthorizedRequest = '/unauthorized-request',
  ViewSecretKey = '/view-secret-key',
  // Locked wallet route
  Unlock = '/unlock',
  SignatureRequest = '/signature',
  ProfileUpdateRequest = '/update-profile',

  // Modal routes
  ChangeTheme = 'change-theme',
  EditNonce = 'edit-nonce',
  SelectNetwork = 'choose-network',
  SignOutConfirm = 'sign-out',

  // Send crypto asset routes
  SendCryptoAsset = '/send',
  SendCryptoAssetForm = '/send/:symbol',
  SendCryptoAssetFormRecipientAccounts = 'recipient-accounts',
  SendBtcCryptoCurrencyConfirmation = '/send/btc/confirmation',
  SendStxCryptoCurrencyConfirmation = '/send/stx/confirmation',
  SendStacksSip10Confirmation = '/send/:symbol/confirmation',
}
