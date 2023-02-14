import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BITCOIN_ENABLED } from '@shared/environment';

import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { RootState } from '..';

type FeatureMode = 'enabled' | 'disabled';

interface FeatureFlagState {
  bitcoin: FeatureMode;
}

const initialState: FeatureFlagState = {
  bitcoin: BITCOIN_ENABLED === 'true' ? 'enabled' : 'disabled',
};

export const featureFlagSlice = createSlice({
  name: 'featureFlag',
  initialState,
  reducers: {
    enableFeature(
      state,
      action: PayloadAction<{ feature: keyof FeatureFlagState; mode: FeatureMode }>
    ) {
      state[action.payload.feature] = action.payload.mode;
    },
  },
});

const selectFeatureFlags = (state: RootState) => state.featureFlags;

interface FeatureFlag {
  isEnabled(): boolean;
  isDisabled(): boolean;
}

function useFeatureFlags() {
  const flags = useSelector(selectFeatureFlags);
  return useMemo(
    () =>
      Object.fromEntries(
        Object.entries(flags).map(([key, value]) => [
          key,
          {
            isEnabled() {
              return value === 'enabled';
            },
            isDisabled() {
              return value === 'disabled';
            },
          },
        ])
      ) as Record<keyof FeatureFlagState, FeatureFlag>,
    [flags]
  );
}

export function useBitcoinFeature() {
  const network = useCurrentNetwork();
  const featureFlags = useFeatureFlags();
  return network.chain.bitcoin.network === 'testnet' || featureFlags.bitcoin.isEnabled();
}
