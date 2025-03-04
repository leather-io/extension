import type { ReactNode } from 'react';

import {
  AnimalChameleonIcon,
  AnimalEagleIcon,
  AnimalRabbitIcon,
  AnimalSnailIcon,
} from '@leather.io/ui';

import { IconWrapper } from '@app/components/icon-wrapper';

import type { FeePriority } from '../fee-editor.context';

const feeTypeToIconMap: Record<FeePriority, ReactNode> = {
  slow: <AnimalSnailIcon />,
  standard: <AnimalRabbitIcon />,
  fast: <AnimalEagleIcon />,
  custom: <AnimalChameleonIcon />,
};

export function FeeItemIcon({ feeType }: { feeType: FeePriority }) {
  const icon = feeTypeToIconMap[feeType] || null;

  if (!icon) {
    throw new Error('Invalid fee type');
  }

  return <IconWrapper>{icon}</IconWrapper>;
}
