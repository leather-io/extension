/**
 * Inpage Script (Stacks Provider) <-> Content Script
 */
export enum DomEventName {
  authenticationRequest = 'stacksAuthenticationRequest',
  signatureRequest = 'signatureRequest',
  structuredDataSignatureRequest = 'structuredDataSignatureRequest',
  transactionRequest = 'stacksTransactionRequest',
}

interface BaseDetails {
  /**
   * Use to capture the URL of the app that initiated a flow to be used in the
   * flow's analytics.
   */
  referringAppDomain?: string;
}

export interface AuthenticationRequestEventDetails extends BaseDetails {
  authenticationRequest: string;
}

export type AuthenticationRequestEvent = CustomEvent<AuthenticationRequestEventDetails>;

export interface SignatureRequestEventDetails extends BaseDetails {
  signatureRequest: string;
}

export type SignatureRequestEvent = CustomEvent<SignatureRequestEventDetails>;

export interface TransactionRequestEventDetails extends BaseDetails {
  transactionRequest: string;
}

export type TransactionRequestEvent = CustomEvent<TransactionRequestEventDetails>;
