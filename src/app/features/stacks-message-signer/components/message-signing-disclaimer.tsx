import { Disclaimer } from '@app/components/disclaimer';

interface DisclaimerProps {
  appName?: string | null;
}
export function StacksMessageSigningDisclaimer({ appName }: DisclaimerProps) {
  return (
    <Disclaimer
      disclaimerText={`By signing this message, you are authorizing ${
        appName ?? 'the app'
      } to do something specific
    on your behalf. Only sign messages that you understand from apps that you trust.
`}
      learnMoreUrl="https://docs.hiro.so/build-apps/message-signing"
      mb="space.05"
    />
  );
}
