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

export enum ScreenPaths {
  GENERATION = '/sign-up',
  SECRET_KEY = '/sign-up/secret-key',
  SETTINGS_KEY = '/settings/secret-key',
  SAVE_KEY = '/sign-up/save-secret-key',
  ONBOARDING_PASSWORD = '/sign-up/set-password',
  USERNAME = '/username',
  SIGN_IN = '/sign-in',
  SIGN_OUT_CONFIRM = '/sign-out',
  RECOVERY_CODE = '/sign-in/recover',
  ADD_ACCOUNT = '/sign-in/add-account',
  CHOOSE_ACCOUNT = '/connect/choose-account',
  REGISTRY_ERROR = '/username-error',
  HOME = '/',
  INSTALLED = '/',
  SIGN_IN_INSTALLED = '/installed/sign-in',
  SIGN_UP_INSTALLED = '/installed/sign-up',
  SET_PASSWORD = '/set-password',
  POPUP_HOME = '/',
  POPUP_SEND = '/send',
  POPUP_RECEIVE = '/receive',
  ADD_NETWORK = '/add-network',
  REQUEST_DIAGNOSTICS = '/request-diagnostics',
  EDIT_POST_CONDITIONS = '/transaction/post-conditions',
  TRANSACTION_POPUP = '/transaction',
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

export interface PaginatedResults<T> {
  limit: number;
  offset: number;
  total: number;
  results: T[];
}

type Amount = number | '';

export interface TransactionFormValues {
  amount: Amount;
  recipient: string;
  txFee: number | string;
  memo: string;
}
