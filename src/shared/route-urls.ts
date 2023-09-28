export enum RouteUrls {
  // Onboarding routes
  RequestDiagnostics = '/get-started/request-diagnostics',
  Onboarding = '/get-started',
  BackUpSecretKey = '/back-up-secret-key',
  SetPassword = '/set-password',
  SignIn = '/sign-in',

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
  LedgerBroadcastError = 'transaction-broadcast-error',
  LedgerAddMoreKeys = 'add-more-keys',

  // Active wallet routes
  Home = '/',
  Activity = '/activity',
  AddNetwork = '/add-network',
  ChooseAccount = '/choose-account',
  Fund = '/fund',
  FundReceive = '/fund/receive',
  FundReceiveStx = '/fund/receive/stx',
  FundReceiveBtc = '/fund/receive/btc',
  IncreaseStxFee = '/increase-fee/stx',
  IncreaseBtcFee = '/increase-fee/btc',
  IncreaseFeeSent = '/increase-fee/sent',
  Receive = '/receive',
  ReceiveCollectible = '/receive/collectible',
  ReceiveCollectibleOrdinal = '/receive/collectible/ordinal',
  ReceiveStx = '/receive/stx',
  ReceiveBtc = '/receive/btc',
  ReceiveBtcStamp = '/receive/btc-stamp',
  Send = '/send-transaction',
  ViewSecretKey = '/view-secret-key',

  // Locked wallet route
  Unlock = '/unlock',

  // Bitcoin Contract routes
  BitcoinContractLockSuccess = '/bitcoin-contract-lock-success',
  BitcoinContractLockError = '/bitcoin-contract-lock-error',
  BitcoinContractList = '/bitcoin-contract-list',

  // Modal routes
  ChangeTheme = 'change-theme',
  EditNonce = 'edit-nonce',
  SelectNetwork = 'choose-network',
  SignOutConfirm = 'sign-out',
  RetriveTaprootFunds = 'retrive-taproot-funds',

  // Send crypto asset routes
  SendCryptoAsset = '/send',
  SendCryptoAssetForm = '/send/:symbol',
  SendSip10Form = '/send/:symbol/:contractId',
  SendCryptoAssetFormRecipientAccounts = 'recipient-accounts',
  SendCryptoAssetFormRecipientBns = 'recipient-bns',
  SendBtcChooseFee = '/send/btc/choose-fee',
  SendBtcConfirmation = '/send/btc/confirm',
  SendBtcDisabled = '/send/btc/disabled',
  SendStxConfirmation = '/send/stx/confirm',
  SendStacksSip10Confirmation = '/send/:symbol/confirm',
  SentBtcTxSummary = '/sent/btc/:txId',
  SentStxTxSummary = '/sent/stx/:txId',
  SendBrc20SendForm = '/send/brc20/:ticker',
  SendBrc20ChooseFee = '/send/brc20/:ticker/choose-fee',
  SendBrc20Confirmation = '/send/brc20/:ticker/confirm',
  SentBrc20Summary = '/send/brc20/:ticker/summary',

  // Send ordinal inscriptions
  SendOrdinalInscription = '/send/ordinal-inscription',
  SendOrdinalInscriptionChooseFee = '/send/ordinal-inscription/choose-fee',
  SendOrdinalInscriptionReview = '/send/ordinal-inscription/review',
  SendOrdinalInscriptionSummary = '/send/ordinal-inscription/',
  SendOrdinalInscriptionSent = '/send/ordinal-inscription/sent',
  SendOrdinalInscriptionError = '/send/ordinal-inscription/error',

  // Swap routes
  Swap = '/swap',
  SwapChooseAsset = '/swap/choose-asset',
  SwapReview = '/swap/review',
  SwapSummary = '/swap/summary',
  SwapSummaryDetails = '/swap/summary/details',

  // Legacy request routes
  ProfileUpdateRequest = '/update-profile',
  PsbtRequest = '/psbt',
  SignatureRequest = '/signature',
  TransactionRequest = '/transaction',
  TransactionBroadcastError = 'broadcast-error',

  // Rpc request routes
  RpcGetAddresses = '/get-addresses',
  RpcSignPsbt = '/sign-psbt',
  RpcSignPsbtSummary = '/sign-psbt/summary',
  RpcSendTransfer = '/send-transfer',
  RpcSendTransferChooseFee = '/send-transfer/choose-fee',
  RpcSendTransferConfirmation = '/send-transfer/confirm',
  RpcSendTransferSummary = '/send-transfer/summary',
  RpcReceiveBitcoinContractOffer = '/bitcoin-contract-offer/:bitcoinContractOffer/:counterpartyWalletURL',
  RpcSignBip322Message = '/sign-bip322-message',

  // Shared legacy and rpc request routes
  RequestError = '/request-error',
  UnauthorizedRequest = '/unauthorized-request',
}
