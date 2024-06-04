import { Button } from '@leather-wallet/ui';

import { Footer } from '@app/ui/components/containers/footers/footer';

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
