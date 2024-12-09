import {
  AnimalChameleonIcon,
  AnimalEagleIcon,
  AnimalRabbitIcon,
  AnimalSnailIcon,
} from '@leather.io/ui';

import type { FeeType } from '@app/common/fees/use-fees';

import { IconWrapper } from '../icon-wrapper';

export function FeeItemIcon({ feeType }: { feeType: FeeType }) {
  function getIcon() {
    if (feeType === 'slow') return <AnimalSnailIcon variant="small" />;
    if (feeType === 'standard') return <AnimalRabbitIcon variant="small" />;
    if (feeType === 'fast') return <AnimalEagleIcon variant="small" />;
    if (feeType === 'custom') return <AnimalChameleonIcon variant="small" />;

    throw new Error('Invalid fee type');
  }

  return <IconWrapper>{getIcon()}</IconWrapper>;
}
