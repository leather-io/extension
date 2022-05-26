import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { Circle, color, Flex, Grid, Stack } from '@stacks/ui';

import { HOME_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { SpaceBetween } from '@app/components/space-between';
import { Text, Title } from '@app/components/typography';
import { useAppDispatch } from '@app/store';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import { useStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import { OnboardingSteps, OnboardingStepStatus, RouteType } from '@shared/models/onboarding-types';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

import { OnboardingStepItem } from './onboarding-step-item';
import { useOnboardingSteps } from '../hooks/use-onboarding-steps';
import { onboardingSteps } from './onboarding-steps';

export function OnboardingStepsList() {
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onboardingStepsStatus = useStepsStatus();
  useOnboardingSteps();

  const handleStepsDismiss = useCallback(() => {
    void analytics.track('dismiss_next_steps');
    dispatch(onboardingActions.hideSteps(true));
  }, [analytics, dispatch]);

  const handleStepStart = useCallback(
    ({ event, route, routeType, title }) => {
      if (title === OnboardingSteps.ExploreApps) {
        dispatch(
          onboardingActions.updateStepsStatus({
            ...onboardingStepsStatus,
            [OnboardingSteps.ExploreApps]: OnboardingStepStatus.Done,
          })
        );
      }
      void analytics.track('select_next_step', { step: event });
      if (routeType === RouteType.Internal) navigate(route);
      else openInNewTab(route);
    },
    [analytics, dispatch, navigate, onboardingStepsStatus]
  );

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
          onClick={() => handleStepsDismiss()}
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
          {onboardingSteps.map(step => (
            <OnboardingStepItem
              action={step.action}
              body={step.body}
              imageFull={step.imageFull}
              imageFullDone={step.imageFullDone}
              imagePopup={step.imagePopup}
              imagePopupDone={step.imagePopupDone}
              isDone={onboardingStepsStatus[step.title] === OnboardingStepStatus.Done}
              key={step.title}
              onClick={() => handleStepStart(step)}
              routeType={step.routeType}
              title={step.title}
            />
          ))}
        </Grid>
      </Flex>
    </>
  );
}
