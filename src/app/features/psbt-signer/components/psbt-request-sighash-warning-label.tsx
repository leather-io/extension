import { Callout } from '@leather.io/ui';

interface PsbtRequestSighashWarningLabelProps {
  origin: string;
}
export function PsbtRequestSighashWarningLabel({ origin }: PsbtRequestSighashWarningLabelProps) {
  return (
    <Callout variant="warning" title="Be careful with this transaction">
      The details of this transaction are not guaranteed and could be modified later. Continue only
      if you trust {origin}
    </Callout>
  );
}
