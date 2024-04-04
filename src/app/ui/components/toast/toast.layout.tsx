import { Box, HStack, styled } from 'leather-styles/jsx';

import { type ToastProps } from './toast';
import { getIconVariant } from './toast.utils';

export function ToastLayout({ message, variant }: ToastProps) {
  return (
    <HStack gap="space.03">
      <Box>{getIconVariant(variant)}</Box>
      <styled.span textStyle="label.02">{message}</styled.span>
    </HStack>
  );
}
