import { FiX } from 'react-icons/fi';
import { Circle, color, Flex, Grid, GridProps, Stack } from '@stacks/ui';

import { HOME_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { SpaceBetween } from '@app/components/space-between';
import { Text, Title } from '@app/components/typography';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

interface SuggestedFirstStepsLayoutProps extends GridProps {
  onDismissSteps(): void;
}
export function SuggestedFirstStepsLayout({
  children,
  onDismissSteps,
}: SuggestedFirstStepsLayoutProps) {
  return (
    <>
      <SpaceBetween
        maxWidth={['unset', HOME_FULL_PAGE_MAX_WIDTH]}
        mt={['tight', 'loose']}
        px={['base-loose', 'base-loose', 'base-loose', 'unset']}
        width="100%"
      >
        <Stack spacing="tight">
          <Text fontSize={[1, 2]}>Welcome to Stacks 👋</Text>
          <Title fontSize={[3, 4]}>Next steps for you</Title>
        </Stack>
        <Circle
          _hover={{ cursor: 'pointer' }}
          data-testid={OnboardingSelectors.HideStepsBtn}
          border="1px solid"
          borderColor={color('border')}
          color={color('bg')}
          onClick={onDismissSteps}
          size="32px"
        >
          <FiX color={color('text-caption')} size="20px" />
        </Circle>
      </SpaceBetween>
      <Flex
        alignItems="center"
        borderBottom="3px solid"
        borderBottomColor={color('bg-4')}
        data-testid={OnboardingSelectors.StepsList}
        justifyContent={['start', 'center']}
        mt={['loose', 'extra-loose']}
        pb={['loose', '48px']}
        width="100%"
      >
        <Grid
          gap={[3, 5, 'unset']}
          maxWidth={['unset', HOME_FULL_PAGE_MAX_WIDTH]}
          px={['base-loose', 'base-loose', 'base-loose', 'unset']}
          templateColumns={['repeat(2, 2fr)', 'repeat(2, 2fr)', 'repeat(4, 1fr)']}
          width="100%"
        >
          {children}
        </Grid>
      </Flex>
    </>
  );
}
