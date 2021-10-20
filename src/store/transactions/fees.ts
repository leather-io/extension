import { atom } from 'jotai';

import { FeeEstimation } from '@models/fees-types';

export const feeEstimationsState = atom<FeeEstimation[]>([]);
export const feeState = atom<number | null>(null);
export const feeRateState = atom<number | null>(null);
