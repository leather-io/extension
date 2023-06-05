import {
  FinishedTxPayload,
  PsbtData,
  SignatureData,
  SponsoredFinishedTxPayload,
} from '@stacks/connect';
import { PublicProfile } from '@stacks/profile';

export const MESSAGE_SOURCE = 'stacks-wallet' as const;

export const CONTENT_SCRIPT_PORT = 'content-script' as const;

export enum ExternalMethods {
  transactionRequest = 'transactionRequest',
  transactionResponse = 'transactionResponse',
  authenticationRequest = 'authenticationRequest',
  authenticationResponse = 'authenticationResponse',
  signatureRequest = 'signatureRequest',
  signatureResponse = 'signatureResponse',
  structuredDataSignatureRequest = 'structuredDataSignatureRequest',
  structuredDataSignatureResponse = 'structuredDataSignatureResponse',
  profileUpdateRequest = 'profileUpdateRequest',
  profileUpdateResponse = 'profileUpdateResponse',
  psbtRequest = 'psbtRequest',
  psbtResponse = 'psbtResponse',
}

export enum InternalMethods {
  RequestDerivedStxAccounts = 'RequestDerivedStxAccounts',
  ShareInMemoryKeyToBackground = 'ShareInMemoryKeyToBackground',
  RequestInMemoryKeys = 'RequestInMemoryKeys',
  RemoveInMemoryKeys = 'RemoveInMemoryKeys',
  OriginatingTabClosed = 'OriginatingTabClosed',
}

export type ExtensionMethods = ExternalMethods | InternalMethods;

interface BaseMessage {
  source: typeof MESSAGE_SOURCE;
  method: ExtensionMethods;
}

/**
 * Content Script <-> Background Script
 */
export interface Message<Methods extends ExtensionMethods, Payload = undefined>
  extends BaseMessage {
  method: Methods;
  payload: Payload;
}

type AuthenticationRequestMessage = Message<ExternalMethods.authenticationRequest, string>;

export type AuthenticationResponseMessage = Message<
  ExternalMethods.authenticationResponse,
  {
    authenticationRequest: string;
    authenticationResponse: string;
  }
>;

type SignatureRequestMessage = Message<ExternalMethods.signatureRequest, string>;

export type SignatureResponseMessage = Message<
  ExternalMethods.signatureResponse,
  {
    signatureRequest: string;
    signatureResponse: SignatureData | string;
  }
>;

type StructuredDataSignatureRequestMessage = Message<
  ExternalMethods.structuredDataSignatureRequest,
  string
>;

type ProfileUpdateRequestMessage = Message<ExternalMethods.profileUpdateRequest, string>;

export type ProfileUpdateResponseMessage = Message<
  ExternalMethods.profileUpdateResponse,
  {
    profileUpdateRequest: string;
    profileUpdateResponse: PublicProfile | string;
  }
>;

type PsbtRequestMessage = Message<ExternalMethods.psbtRequest, string>;

export type PsbtResponseMessage = Message<
  ExternalMethods.psbtResponse,
  {
    psbtRequest: string;
    psbtResponse: PsbtData | string;
  }
>;

type TransactionRequestMessage = Message<ExternalMethods.transactionRequest, string>;

export type TxResult = SponsoredFinishedTxPayload | FinishedTxPayload;

export type TransactionResponseMessage = Message<
  ExternalMethods.transactionResponse,
  {
    transactionRequest: string;
    transactionResponse: TxResult | string;
  }
>;

export type LegacyMessageFromContentScript =
  | AuthenticationRequestMessage
  | TransactionRequestMessage
  | SignatureRequestMessage
  | StructuredDataSignatureRequestMessage
  | ProfileUpdateRequestMessage
  | PsbtRequestMessage;

export type LegacyMessageToContentScript =
  | AuthenticationResponseMessage
  | TransactionResponseMessage
  | SignatureResponseMessage
  | ProfileUpdateResponseMessage
  | PsbtResponseMessage;
