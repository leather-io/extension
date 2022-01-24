import { ExtensionMethods, InternalMethods, Message } from '@shared/message-types';

/**
 * Vault <-> Background Script
 */
type BackgroundMessage<Msg extends ExtensionMethods, Payload = undefined> = Omit<
  Message<Msg, Payload>,
  'source'
>;

export type RequestDerivedStxAccounts = BackgroundMessage<
  InternalMethods.RequestDerivedStxAccounts,
  { secretKey: string; highestAccountIndex: number }
>;

export type BackgroundActions = RequestDerivedStxAccounts;
