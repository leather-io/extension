import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { color, Stack } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { Header } from '@app/components/header';
import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';
import { PrimaryButton } from '@app/components/primary-button';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Text } from '@app/components/typography';
import { PageTitle } from '@app/components/page-title';
import { RouteUrls } from '@shared/route-urls';

export const ViewSecretKey = memo(() => {
  const analytics = useAnalytics();
  const navigate = useNavigate();

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Home)} />);

  useEffect(() => {
    void analytics.page('view', '/save-secret-key');
  }, [analytics]);

  return (
    <CenteredPageContainer>
      <Stack
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        pb={['loose', 'unset']}
        px={['unset', 'base-loose']}
        spacing="loose"
      >
        <PageTitle fontSize={[4, 8]}>Your Secret Key</PageTitle>
        <Text color={color('text-caption')} textAlign={['left', 'center']}>
          These 24 words are your Secret Key. They create your account, and you sign in on different
          devices with them. Make sure to save these somewhere safe.{' '}
          <Text display="inline" fontWeight={500}>
            If you lose these words, you lose your account.
          </Text>
        </Text>
        <SecretKeyDisplayer />
        <PrimaryButton onClick={() => navigate(RouteUrls.Home)}>I've saved it</PrimaryButton>
      </Stack>
    </CenteredPageContainer>
  );
});
