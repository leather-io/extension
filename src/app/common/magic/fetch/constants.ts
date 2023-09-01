import type { ClarigenClient } from '@clarigen/core';
import type ElectrumClient from 'electrum-client-sl';

import { DefaultNetworkConfigurations } from '@shared/constants';

import { MagicContracts } from '..';

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
export interface MagicFetchElectrumContext {
  electrumClient: ElectrumClient;
  network: DefaultNetworkConfigurations;
}

export type MagicFetchContextWithElectrum = MagicFetchContext & MagicFetchElectrumContext;
