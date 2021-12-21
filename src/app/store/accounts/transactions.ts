import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { atom } from 'jotai';

export const accountTransactionsWithTransfersState = atom<AddressTransactionWithTransfers[]>([]);
