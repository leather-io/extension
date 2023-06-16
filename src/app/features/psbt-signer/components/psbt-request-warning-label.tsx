import { WarningLabel } from '@app/components/warning-label';

export function PsbtRequestAppWarningLabel(props: { appName?: string }) {
  const { appName } = props;
  const title = `Do not proceed unless you trust ${appName ?? 'Unknown'}!`;

  return (
    <WarningLabel title={title} width="100%">
      Signing this PSBT can have dangerous side effects. Only sign if the PSBT is from a site you
      trust.
    </WarningLabel>
  );
}
