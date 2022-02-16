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
  SignLedgerTransaction = 'awaiting-approval',
  LedgerDisconnected = 'your-ledger-disconnected',
  TransactionRejected = 'transaction-rejected',
  LedgerPublicKeyMismatch = 'wrong-ledger-device',
  LedgerUnsupportedBrowser = 'unsupported-browser',

  AuthNotSupportedWithLedger = '/auth-not-supported-with-hardware-wallet',

  // Active wallet routes
  Home = '/',
  AddNetwork = '/add-network',
  Buy = '/buy',
  ChooseAccount = '/choose-account',
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
