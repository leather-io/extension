import { Text } from '@stacks/ui';
import { Flex } from 'leather-styles/jsx';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { EyeSlashIcon } from '@app/ui/components/icons/eye-slash-icon';

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
      <EyeSlashIcon pb="12px" size="24px" />
      <Text fontSize="12px" lineHeight="16px">
        Image currently
      </Text>
      <Text fontSize="12px" lineHeight="16px">
        unavailable
      </Text>
    </Flex>
  );
}
