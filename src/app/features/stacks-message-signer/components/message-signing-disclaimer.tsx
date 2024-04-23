import { Disclaimer } from '@app/components/disclaimer';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

interface DisclaimerProps {
  appName?: string | null;
}
export function StacksMessageSigningDisclaimer({ appName, address }: DisclaimerProps) {
  return (
    <Disclaimer
      disclaimerText={`By signing this message, you prove that you own your Stacks address.`}
      mb="space.05"
    />
  );
}
