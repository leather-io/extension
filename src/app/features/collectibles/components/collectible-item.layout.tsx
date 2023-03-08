import { ReactNode } from 'react';

import { Box, Button, Stack, Text } from '@stacks/ui';
import type { BoxProps } from '@stacks/ui';
import { color } from '@stacks/ui-utils';
import { useHover } from 'use-events';

import { figmaTheme } from '@app/common/utils/figma-theme';

import { CollectibleHover } from './collectible-hover';

export interface CollectibleItemLayoutProps {
  backgroundElementProps?: BoxProps;
  children: ReactNode;
  hoverText?: string;
  onClickCallToAction?(): void;
  onClickLayout?(): void;
  onClickSend?(): void;
  collectibleTypeIcon?: JSX.Element;
  subtitle: string;
  title: string;
}
export function CollectibleItemLayout({
  backgroundElementProps,
  children,
  onClickCallToAction,
  onClickSend,
  onClickLayout,
  collectibleTypeIcon,
  subtitle,
  title,
}: CollectibleItemLayoutProps) {
  const [isHovered, bind] = useHover();

  return (
    <Box>
      <Box
        _focus={{
          outline: `4px solid ${figmaTheme.borderFocused}`,
          outlineOffset: '-4px',
        }}
        _hover={{
          backgroundColor: figmaTheme.surfaceHovered,
        }}
        as={onClickLayout ? 'button' : 'div'}
        borderRadius="20px"
        onClick={onClickLayout}
        padding="4px"
        sx={{
          // Buttons have had styles applied that center their children text
          // nodes, which is undesirable in this case. A button is being used more
          // for its actionability (focus, onclick) & accessibility rather than
          // for its styles.
          textAlign: 'inherit',
          width: '100%',
        }}
        {...bind}
      >
        <Box height="0px" position="relative" pb="100%">
          <CollectibleHover
            onClickCallToAction={onClickCallToAction}
            collectibleTypeIcon={collectibleTypeIcon}
            isHovered={isHovered}
          />
          <Box
            alignItems="center"
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

        {onClickSend ? (
          <Box padding="8px">
            <Button
              mode="tertiary"
              p="6px 12px"
              sx={{
                // Used to hide the button visually while keeping it in the accessibility tree.
                clipPath: isHovered ? 'none' : 'circle(0%)',
              }}
              onClick={e => {
                e.stopPropagation();
                onClickSend && onClickSend();
              }}
              _focus={{ clipPath: 'none', outline: `4px solid ${figmaTheme.borderFocused}` }}
            >
              Send
            </Button>
          </Box>
        ) : (
          // Spacer
          <Box padding="4px" />
        )}
      </Box>
    </Box>
  );
}
