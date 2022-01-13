import { Box, color } from '@stacks/ui';

import { Text } from '@app/components/typography';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

interface SecretKeyWordProps {
  word: string;
}
export function SecretKeyWord(props: SecretKeyWordProps) {
  const { word } = props;

  return (
    <Box border="1px solid" borderColor={color('border')} borderRadius="8px" p="tight">
      <Text data-testid={OnboardingSelectors.SecretKey}>{word}</Text>
    </Box>
  );
}
