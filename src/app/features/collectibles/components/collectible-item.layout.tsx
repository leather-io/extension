import { ReactNode } from 'react';

import { Box, BoxProps, Stack, styled } from 'leather-styles/jsx';
import { useHover } from 'use-events';

import { CollectibleHover } from './collectible-hover';

export interface CollectibleItemLayoutProps {
  backgroundElementProps?: BoxProps;
  children: ReactNode;
  hoverText?: string;
  onClickCallToAction?(): void;
  onClickLayout?(): void;
  onClickSend?(): void;
  collectibleTypeIcon?: React.JSX.Element;
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
      <styled.button
        _focus={{
          outline: onClickLayout ? 'focus' : 'unset',
          outlineOffset: onClickLayout ? '-4px' : 'unset',
        }}
        _hover={{ bg: 'accent.background-secondary' }}
        borderRadius="20px"
        cursor={onClickLayout ? 'pointer' : 'default'}
        onClick={onClickLayout}
        p="space.01"
        textAlign="inherit"
        width="100%"
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
            borderRadius="lg"
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
        <Stack gap="space.01" mt="space.04" pl="space.02" textAlign="left">
          <styled.span
            overflow="hidden"
            textOverflow="ellipsis"
            textStyle="label.01"
            whiteSpace="nowrap"
            width="95%"
          >
            {title}
          </styled.span>
          <styled.span color="accent.text-subdued" textStyle="caption.01">
            {subtitle}
          </styled.span>
        </Stack>
        {onClickSend ? (
          <Box p="space.02">
            <styled.button
              _focus={{ clipPath: 'none', outline: 'focus' }}
              _hover={{ bg: 'accent.background-primary' }}
              borderRadius="sm"
              clipPath={isHovered ? 'none' : 'circle(0%)'}
              onClick={e => {
                e.stopPropagation();
                onClickSend();
              }}
              px="space.03"
              py="space.02"
              textStyle="caption.01"
            >
              Send
            </styled.button>
          </Box>
        ) : (
          <Box p="space.01" />
        )}
      </styled.button>
    </Box>
  );
}
