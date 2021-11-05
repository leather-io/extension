import {
  AssetInfo,
  ClarityValue,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostConditionPrincipal,
  PostConditionType,
  StacksMessageType,
} from '@stacks/transactions';
import BN from 'bn.js';

export enum RouteUrls {
  Home = '/',
  RequestDiagnostics = '/request-diagnostics',
  // SignUp = '/sign-up',
  Username = '/username',
  SignOutConfirm = '/sign-out',
  RecoveryCode = '/sign-in/recover',
  AddAccount = '/sign-in/add-account',
  ChooseAccount = '/choose-account',
  Installed = '/installed',
  SetPassword = '/installed/set-password',
  InstalledSaveKey = '/installed/save-secret-key',
  InstalledRestoreKey = '/installed/restore-key',
  SendTokens = '/send',
  ReceiveTokens = '/receive',
  AddNetwork = '/add-network',
  SignTransaction = '/transaction',
  Unlock = '/unlock',
  SignedOut = '/signed-out',
}

// TODO: clarify usage of password for local key encryption
export const DEFAULT_PASSWORD = 'password';

// Not currently exported from @stacks/transactions
export interface STXPostCondition {
  readonly type: StacksMessageType.PostCondition;
  readonly conditionType: PostConditionType.STX;
  readonly principal: PostConditionPrincipal;
  readonly conditionCode: FungibleConditionCode;
  readonly amount: BN;
}
export interface FungiblePostCondition {
  readonly type: StacksMessageType.PostCondition;
  readonly conditionType: PostConditionType.Fungible;
  readonly principal: PostConditionPrincipal;
  readonly conditionCode: FungibleConditionCode;
  readonly amount: BN;
  readonly assetInfo: AssetInfo;
}
export interface NonFungiblePostCondition {
  readonly type: StacksMessageType.PostCondition;
  readonly conditionType: PostConditionType.NonFungible;
  readonly principal: PostConditionPrincipal;
  readonly conditionCode: NonFungibleConditionCode;
  readonly assetInfo: AssetInfo;
  readonly assetName: ClarityValue;
}
