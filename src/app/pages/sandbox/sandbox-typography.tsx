import { Flex, Stack, styled } from 'leather-styles/jsx';

import { textStyles } from '../../../../theme/typography';

const textVariants = Object.keys(textStyles);

export function SandboxTypography() {
  return (
    <Stack gap="space.07">
      {textVariants.map((variant: any) => (
        <Flex alignItems="center" gap="space.03" key={variant}>
          variant: {variant}
          <styled.span textStyle={variant}>Lorem ipsum</styled.span>
        </Flex>
      ))}
    </Stack>
  );
}
