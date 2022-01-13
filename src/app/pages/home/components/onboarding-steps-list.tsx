import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { Circle, color, Flex, Stack } from '@stacks/ui';

import { HOME_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { SpaceBetween } from '@app/components/space-between';
import { Text, Title } from '@app/components/typography';
import { useAppDispatch } from '@app/store';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import { useStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import AddFundsFull from '@assets/images/onboarding/steps/add-funds-light.png';
import BackUpSecretKeyFull from '@assets/images/onboarding/steps/backup-key-light.png';
import ExploreAppsFull from '@assets/images/onboarding/steps/explore-apps-light.png';
import RegisterNameFull from '@assets/images/onboarding/steps/register-name-light.png';
import AddFundsPopup from '@assets/images/onboarding/steps/add-funds-light-sm.png';
import BackUpSecretKeyPopup from '@assets/images/onboarding/steps/backup-key-light-sm.png';
import ExploreAppsPopup from '@assets/images/onboarding/steps/explore-apps-light-sm.png';
import RegisterNamePopup from '@assets/images/onboarding/steps/register-name-light-sm.png';
import { OnboardingSteps, OnboardingStepStatus } from '@shared/models/onboarding-types';
import { RouteUrls } from '@shared/route-urls';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

import { OnboardingStepItem } from './onboarding-step-item';
import { useOnboardingSteps } from '../hooks/use-onboarding-steps';

const onboardingSteps = [
  {
    body: "Don't lose access to your account and crypto",
    event: 'back_up_secret_key',
    imageFull: BackUpSecretKeyFull,
    imagePopup: BackUpSecretKeyPopup,
    route: RouteUrls.ViewSecretKey,
    title: OnboardingSteps.BackUpSecretKey,
  },
  {
    body: 'Get some STX so you can start using apps',
    event: 'add_funds',
    imageFull: AddFundsFull,
    imagePopup: AddFundsPopup,
    route: RouteUrls.Buy,
    title: OnboardingSteps.AddFunds,
  },
  {
    body: 'Register your unique decentralized name',
    event: 'register_name',
    imageFull: RegisterNameFull,
    imagePopup: RegisterNamePopup,
    route: 'https://btc.us/',
    title: OnboardingSteps.RegisterName,
  },
  {
    body: 'Try Stacks apps for finance, NFTs, blogging and more',
    event: 'explore_apps',
    imageFull: ExploreAppsFull,
    imagePopup: ExploreAppsPopup,
    route: 'https://www.stacks.co/explore/discover-apps#apps',
    title: OnboardingSteps.ExploreApps,
  },
];

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
    (event: string, route: string, title: string) => {
      if (title === OnboardingSteps.ExploreApps) {
        dispatch(
          onboardingActions.updateStepsStatus({
            ...onboardingStepsStatus,
            [OnboardingSteps.ExploreApps]: OnboardingStepStatus.Done,
          })
        );
      }
      void analytics.track('select_next_step', { step: event });
      if (route.startsWith('/')) navigate(route);
      else openInNewTab(route);
    },
    [analytics, dispatch, navigate, onboardingStepsStatus]
  );

  return (
    <>
      <SpaceBetween
        maxWidth={['unset', HOME_FULL_PAGE_MAX_WIDTH]}
        mt={['tight', 'loose']}
        px={['base-loose', 'unset']}
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
        flexWrap={['wrap', 'no-wrap']}
        gap={['tight', 'unset']}
        justifyContent={['start', 'center']}
        mt={['loose', 'extra-loose']}
        pb={['loose', '48px']}
        px={['base-loose', 'unset']}
        rowGap={['tight', 'unset']}
        width="100%"
      >
        {onboardingSteps.map(step => (
          <OnboardingStepItem
            body={step.body}
            imageFull={step.imageFull}
            imagePopup={step.imagePopup}
            isDone={onboardingStepsStatus[step.title] === OnboardingStepStatus.Done}
            key={step.title}
            onClick={() => handleStepStart(step.event, step.route, step.title)}
            title={step.title}
          />
        ))}
      </Flex>
    </>
  );
}
