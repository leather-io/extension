import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type RootState, useAppDispatch } from '..';

export const missingDataSlice = createSlice({
  name: 'missingStacksNfts',
  initialState: {
    stacksNfts: [] as string[],
  },
  reducers: {
    addKnownMissingStacksNft(state, action: PayloadAction<string>) {
      state.stacksNfts.push(action.payload);
    },
  },
});

const { addKnownMissingStacksNft } = missingDataSlice.actions;

const selectMisingStacksNfts = (state: RootState) => state.missingData;

export function useStacksNftMissingMetadata() {
  const dispatch = useAppDispatch();
  const missingData = useSelector(selectMisingStacksNfts);
  return useMemo(
    () => ({
      missingNftIds: missingData.stacksNfts,
      isMissingStacksNftMetadata(id: string) {
        return missingData.stacksNfts.includes(id);
      },
      addKnownMissingStacksNft(id: string) {
        dispatch(addKnownMissingStacksNft(id));
      },
    }),
    [dispatch, missingData.stacksNfts]
  );
}
