import { Box, Flex } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

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
      <styled.span fontSize="12px" lineHeight="16px">
        Image currently
      </styled.span>
      <styled.span fontSize="12px" lineHeight="16px">
        unavailable
      </styled.span>
    </Flex>
  );
}
