import type { ClarigenClient } from '@clarigen/core';

import { DefaultNetworkConfigurations } from '@shared/constants';

import { MagicContracts } from '../client';
import { BitcoinClient } from '@app/query/bitcoin/bitcoin-client';

/**
 * Contains context for a Magic fetch operation.
 */
export interface MagicFetchContext {
  magicClient: ClarigenClient;
  magicContracts: MagicContracts;
}

/**
 * Contains context for a Magic fetch operation using Electrum.
 */
export interface MagicFetchBitcoinContext {
  bitcoinClient: BitcoinClient;
  network: DefaultNetworkConfigurations;
}

export type MagicFetchContextWithBitcoin = MagicFetchContext & MagicFetchBitcoinContext;
