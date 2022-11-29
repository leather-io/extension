import { DisclaimerLayout } from '@app/components/disclaimer';

interface DisclaimerProps {
  appName?: string;
}
export function Disclaimer({ appName }: DisclaimerProps) {
  return (
    <DisclaimerLayout
      disclaimerText={`By signing this message, you are authorizing ${
        appName ?? 'the app'
      } to do something specific
    on your behalf. Only sign messages that you understand from apps that you trust.
`}
      learnMoreUrl="https://docs.hiro.so/build-apps/message-signing"
    />
  );
}
