import { WarningLabel } from '@app/components/warning-label';

export function PsbtRequestWarningLabel(props: { appName?: string }) {
  const { appName } = props;
  const title = `Do not proceed unless you trust ${appName ?? 'Unknown'}!`;

  return (
    <WarningLabel title={title}>
      Signing this PSBT can have dangerous side effects. Only sign if the PSBT is from a site you
      fully trust.
    </WarningLabel>
  );
}
