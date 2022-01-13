export enum RouteUrls {
  Container = '/',
  // Onboarding routes
  Onboarding = '/onboarding',
  BackUpSecretKey = '/back-up-secret-key',
  ConnectLedger = '/onboarding/connect-ledger',
  ConnectLedgerError = '/onboarding/connect-ledger-error',
  ConnectLedgerSuccess = '/onboarding/connect-ledger-success',
  SetPassword = '/set-password',
  SignIn = '/sign-in',
  MagicRecoveryCode = '/recovery-code',
  RequestDiagnostics = '/request-diagnostics',
  // Active wallet routes
  Home = '/',
  AddNetwork = '/add-network',
  Buy = '/buy',
  ChooseAccount = '/choose-account',
  Receive = '/receive',
  Send = '/send',
  SignOutConfirm = '/sign-out',
  Transaction = '/transaction',
  ViewSecretKey = '/view-secret-key',
  // Locked wallet route
  Unlock = '/unlock',
}
