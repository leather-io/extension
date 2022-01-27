import { Text } from '@app/components/typography';

interface ViewSecretKeyMessageProps {
  wordCount: number;
}
export function ViewSecretKeyMessage(props: ViewSecretKeyMessageProps): JSX.Element {
  const { wordCount } = props;

  return (
    <Text textAlign={['left', null, 'center']}>
      Here’s your Secret Key: {wordCount} words that generated your Stacks account. You’ll need it
      to access your account on a new device, in a different wallet, or in case you lose your
      password — so back it up somewhere safe.
    </Text>
  );
}
