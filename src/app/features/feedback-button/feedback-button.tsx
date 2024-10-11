import { Box, Flex } from 'leather-styles/jsx';

import { Button, MegaphoneIcon } from '@leather.io/ui';

import { openFeedbackSheet } from '@shared/utils/analytics';

import { useThemeSwitcher } from '@app/common/theme-provider';

export function FeedbackButton() {
  const { theme } = useThemeSwitcher();
  return (
    <Button
      _hover={{ bg: 'ink.background-secondary' }}
      bg="ink.background-primary"
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
      onClick={openFeedbackSheet}
    >
      <Flex>
        <Box mr="space.01" mt="2px">
          <MegaphoneIcon variant="small" />
        </Box>
        Give feedback
      </Flex>
    </Button>
  );
}
