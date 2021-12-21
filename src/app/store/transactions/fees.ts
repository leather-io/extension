import { atom } from 'jotai';

import { FeeEstimation } from '@shared/models/fees-types';

export const feeEstimationsState = atom<FeeEstimation[]>([]);
