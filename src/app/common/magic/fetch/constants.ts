import type { ClarigenClient } from '@clarigen/core';
import type ElectrumClient from 'electrum-client-sl';

import { DefaultNetworkConfigurations } from '@shared/constants';

import { MagicContracts } from '..';

export interface MagicFetchContext {
  magicClient: ClarigenClient;
  magicContracts: MagicContracts;
}

export interface MagicFetchElectrumContext {
  network: DefaultNetworkConfigurations;
  electrumClient: ElectrumClient;
}

export type MagicFetchContextWithElectrum = MagicFetchContext & MagicFetchElectrumContext;
