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
  LedgerUnsupportedBrowser = 'unsupported-browser',

  // Active wallet routes
  Home = '/',
  AddNetwork = '/add-network',
  ChooseAccount = '/choose-account',
  Fund = '/fund',
  FundReceive = '/fund/receive',
  IncreaseFee = '/increase-fee',
  Receive = '/receive',
  Send = '/send-transaction',
  SignOutConfirm = '/sign-out',
  TransactionRequest = '/transaction',
  UnauthorizedRequest = '/unauthorized-request',
  ViewSecretKey = '/view-secret-key',
  // Locked wallet route
  Unlock = '/unlock',
  SignatureRequest = '/signature',
}
