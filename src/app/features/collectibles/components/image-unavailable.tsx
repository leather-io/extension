import { Box, Flex } from '@stacks/ui';
import { Text } from '@stacks/ui';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { EyeSlashIcon } from '@app/components/icons/eye-slash-icon';

export function ImageUnavailable() {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      height="100%"
      width="100%"
      backgroundColor={figmaTheme.surfaceSecondary}
    >
      <Box pb="12px">
        <EyeSlashIcon />
      </Box>
      <Text fontSize="12px" lineHeight="16px">
        Image currently
      </Text>
      <Text fontSize="12px" lineHeight="16px">
        unavailable
      </Text>
    </Flex>
  );
}
