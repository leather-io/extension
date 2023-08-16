import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Flex, FlexProps, styled } from 'leaf-styles/jsx';

interface SecretKeyWordProps extends FlexProps {
  word: string;
  num: number;
}
export function SecretKeyWord({ word, num, ...rest }: SecretKeyWordProps) {
  return (
    <Flex textStyle="label.02" px="space.04" py="space.03" flex="1" alignItems="end" {...rest}>
      <styled.span mr="space.01">{num}.</styled.span>
      <styled.span verticalAlign="baseline" data-testid={OnboardingSelectors.SecretKey}>
        {word}
      </styled.span>
    </Flex>
  );
}
