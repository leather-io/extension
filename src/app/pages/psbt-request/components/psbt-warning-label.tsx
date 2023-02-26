import { WarningLabel } from '@app/components/warning-label';

export function PsbtWarningLabel(props: { appName?: string }) {
  const { appName } = props;
  const title = `Do not proceed unless you trust ${appName ?? 'Unknown'} entirely!`;

  return (
    <WarningLabel title={title}>
      Signing this PSBT can have dangerous side effects. Only sign if the PSBT is from a site you
      fully trust with your entire account.
    </WarningLabel>
  );
}
