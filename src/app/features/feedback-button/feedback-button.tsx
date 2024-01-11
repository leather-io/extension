import { BrowserClient, Feedback, getCurrentHub } from '@sentry/react';
import { Flex } from 'leather-styles/jsx';

import { analytics } from '@shared/utils/analytics';

import { useThemeSwitcher } from '@app/common/theme-provider';
import { Button } from '@app/ui/components/button/button';
import { MegaphoneIcon } from '@app/ui/components/icons/megaphone-icon';

export function openFeedbackDialog() {
  void analytics.track('user_clicked_feedback_button');
  const client = getCurrentHub().getClient<BrowserClient>();
  const feedback = client?.getIntegration(Feedback);
  if (!feedback) return;
  feedback.openDialog();
}

export function FeedbackButton() {
  const { theme } = useThemeSwitcher();
  return (
    <Button
      background="ink.1"
      _hover={{ background: 'ink.2' }}
      variant="ghost"
      size="sm"
      pos="fixed"
      bottom="space.04"
      right="space.04"
      left="auto"
      top="auto"
      boxShadow={
        theme === 'light'
          ? '0px 12px 24px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 0px 2px 0px rgba(18, 16, 15, 0.08);'
          : undefined
      }
      filter={
        theme === 'dark'
          ? 'drop-shadow(0px 12px 24px rgba(247, 245, 243, 0.08)) drop-shadow(0px 4px 8px rgba(247, 245, 243, 0.08)) drop-shadow(0px 0px 2px rgba(247, 245, 243, 0.50));'
          : undefined
      }
      zIndex={9}
      onClick={openFeedbackDialog}
    >
      <Flex>
        <MegaphoneIcon mr="space.01" mt="2px" />
        Give feedback
      </Flex>
    </Button>
  );
}
