import { z } from 'zod';

import {
  type DefaultNetworkConfigurations,
  WalletDefaultNetworkConfigurationIds,
} from '@leather.io/models';

type NonEmptyNetworkList = [DefaultNetworkConfigurations, ...DefaultNetworkConfigurations[]];

export const defaultNetworksSchema = z.enum(
  Object.values(WalletDefaultNetworkConfigurationIds) as NonEmptyNetworkList
);
