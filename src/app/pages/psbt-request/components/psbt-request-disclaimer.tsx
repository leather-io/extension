import { DisclaimerLayout } from '@app/components/disclaimer';

interface PsbtRequestDisclaimerProps {
  appName?: string;
}
export function PsbtRequestDisclaimer({ appName }: PsbtRequestDisclaimerProps) {
  return (
    <DisclaimerLayout
      disclaimerText={`By signing this PSBT, you are authorizing ${
        appName ?? 'the app'
      } to do something specific
    on your behalf. Only sign PSBTs that you understand from apps that you trust.
`}
    />
  );
}
