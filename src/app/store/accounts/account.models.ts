import { Account } from '@stacks/wallet-sdk';

export type AccountWithAddress = Account & { address: string };
