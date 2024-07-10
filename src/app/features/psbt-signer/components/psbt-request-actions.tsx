import { Button } from '@leather.io/ui';

import { Footer } from '@app/components/layout';

interface PsbtRequestActionsProps {
  isLoading?: boolean;
  onCancel(): void;
  onSignPsbt(): void;
}
export function PsbtRequestActions({ isLoading, onCancel, onSignPsbt }: PsbtRequestActionsProps) {
  return (
    <Footer flexDirection="row">
      <Button flexGrow={1} onClick={onCancel} variant="outline">
        Cancel
      </Button>
      <Button flexGrow={1} aria-busy={isLoading} onClick={onSignPsbt}>
        Confirm
      </Button>
    </Footer>
  );
}
