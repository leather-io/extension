import { RootState } from '@app/store';

export const selectStacksChain = (state: RootState) => state.chains.stx;
