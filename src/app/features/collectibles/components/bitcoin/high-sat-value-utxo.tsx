import { Box, Circle } from 'leather-styles/jsx';

import type { Inscription } from '@leather.io/models';

import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

const featureBuilt = false;

interface HighSatValueUtxoProps {
  inscription: Inscription;
}

export function HighSatValueUtxoWarning({ inscription }: HighSatValueUtxoProps) {
  if (Number(inscription.value) < 5_000) return null;
  if (!featureBuilt) return null;
  return (
    <Box position="absolute" top="space.01" right="space.01">
      <BasicTooltip label="This inscription has loads of BTC on it, remove protections? Click">
        <Circle bg="red" size="sm" />
      </BasicTooltip>
    </Box>
  );
}
