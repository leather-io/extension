import type { ReactNode } from 'react';

import {
  AnimalChameleonIcon,
  AnimalEagleIcon,
  AnimalRabbitIcon,
  AnimalSnailIcon,
} from '@leather.io/ui';

import { IconWrapper } from '@app/components/icon-wrapper';

import type { EditorFeeType } from '../fee-editor.context';

const feeTypeToIconMap: Record<EditorFeeType, ReactNode> = {
  slow: <AnimalSnailIcon />,
  standard: <AnimalRabbitIcon />,
  fast: <AnimalEagleIcon />,
  custom: <AnimalChameleonIcon />,
};

export function FeeItemIcon({ feeType }: { feeType: EditorFeeType }) {
  const icon = feeTypeToIconMap[feeType] || null;

  if (!icon) {
    throw new Error('Invalid fee type');
  }

  return <IconWrapper>{icon}</IconWrapper>;
}
