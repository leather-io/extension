import { ReactNode } from 'react';

import { Box, Stack, Text } from '@stacks/ui';
import type { BoxProps } from '@stacks/ui';
import { color } from '@stacks/ui-utils';

import { CollectibleHover } from './collectible-hover';

export interface CollectibleLayoutProps {
  backgroundElementProps?: BoxProps;
  children: ReactNode;
  hoverText?: string;
  onSelectCollectible?(): void;
  subtitle: string;
  title: string;
}
export function CollectibleLayout({
  backgroundElementProps,
  children,
  hoverText,
  onSelectCollectible,
  subtitle,
  title,
}: CollectibleLayoutProps) {
  return (
    <Box
      _focus={{
        outline: '4px solid #CEDAFA',
      }}
      as={onSelectCollectible ? 'button' : 'div'}
      borderRadius="16px"
      onClick={onSelectCollectible}
    >
      <Box height="0px" position="relative" pb="100%">
        <CollectibleHover hoverText={hoverText} />
        <Box
          alignItems="center"
          backgroundColor="black"
          borderRadius="16px"
          display="flex"
          height="100%"
          justifyContent="center"
          left="0px"
          overflow="hidden"
          position="absolute"
          top="0px"
          width="100%"
          {...backgroundElementProps}
        >
          {children}
        </Box>
      </Box>
      <Stack mt="base" pl="tight" spacing="extra-tight" textAlign="left">
        <Text
          color={color('text-body')}
          fontWeight="500"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          width={['150px', '200px']}
        >
          {title}
        </Text>
        <Text color={color('text-caption')} fontSize={1}>
          {subtitle}
        </Text>
      </Stack>
    </Box>
  );
}
