import { WarningLabel } from '@app/components/warning-label';

interface PsbtRequestSighashWarningLabelProps {
  origin: string;
}
export function PsbtRequestSighashWarningLabel({ origin }: PsbtRequestSighashWarningLabelProps) {
  return (
    <WarningLabel title="Be careful with this transaction" width="100%">
      The details of this transaction are not guaranteed and could be modified later. Continue only
      if you trust {origin}
    </WarningLabel>
  );
}
