import { useWallet } from '@common/hooks/use-wallet';
import { Body, Text } from '@components/typography';

export function SecretKeyMessage(): JSX.Element {
  const { secretKey } = useWallet();
  const wordCount = (secretKey || '').split(' ').length;

  return (
    <Body className="onboarding-text">
      These {wordCount} words are your Secret Key. They create your account, and you sign in on
      different devices with them. Make sure to save these somewhere safe.{' '}
      <Text display="inline" fontWeight={500}>
        If you lose these words, you lose your account.
      </Text>
    </Body>
  );
}
