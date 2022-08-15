import { TransactionPayload } from '@stacks/connect';
import { atom } from 'jotai';

/**
 * @deprecated
 */
export const requestTokenPayloadState = atom<TransactionPayload | null>(null);

export const transactionRequestNetwork = atom(get => get(requestTokenPayloadState)?.network);
