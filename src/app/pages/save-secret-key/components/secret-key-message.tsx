import { isFullPage } from '@app/common/utils';
import { Body } from '@app/components/typography';

interface SecretKeyMessageProps {
  wordCount: number;
}
export function SecretKeyMessage(props: SecretKeyMessageProps): JSX.Element {
  const { wordCount } = props;

  return (
    <Body textAlign={isFullPage ? 'center' : 'left'}>
      Here’s your Secret Key: {wordCount} words that generated your Stacks account. You’ll need it
      to access your account on a new device, in a different wallet, or in case you lose your
      password — so back it up somewhere safe.
    </Body>
  );
}
