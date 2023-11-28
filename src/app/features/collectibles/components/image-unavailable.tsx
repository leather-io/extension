import { Flex, styled } from 'leather-styles/jsx';

import { EyeSlashIcon } from '@app/ui/components/icons/eye-slash-icon';

export function ImageUnavailable() {
  return (
    <Flex
      alignItems="center"
      bg="accent.component-background-default"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      textAlign="center"
      width="100%"
    >
      <EyeSlashIcon pb="12px" size="md" />
      <styled.span textStyle="label.03">Image currently</styled.span>
      <styled.span textStyle="label.03">unavailable</styled.span>
    </Flex>
  );
}
