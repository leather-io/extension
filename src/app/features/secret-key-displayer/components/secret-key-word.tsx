import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Flex, FlexProps, styled } from 'leather-styles/jsx';

interface SecretKeyWordProps extends FlexProps {
  word: string;
  num: number;
}
export function SecretKeyWord({ word, num }: SecretKeyWordProps) {
  return (
    <Flex
      height="3rem"
      width="100%"
      gap="space.01"
      px="space.03"
      backgroundColor="accent.component-background-default"
      borderRadius="xs"
    >
      {/*  FIXME #4130: need to fix this color color: var(--color-grey-light-8, #BBB); */}
      <styled.span display="flex" alignItems="center" mr="space.01" color="accent.text-subdued">
        {num}.
      </styled.span>
      <styled.span
        display="flex"
        alignItems="center"
        color="accent.text-primary"
        data-testid={OnboardingSelectors.SecretKey}
      >
        {word}
      </styled.span>
    </Flex>
  );
}
