import { ReactNode } from 'react';

import { Box, BoxProps, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';
import { useHover } from 'use-events';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { LeatherButton } from '@app/components/button/button';

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
      <Box
        _focus={{
          outline: `4px solid ${token('colors.accent.background-secondary')}`,
          outlineOffset: '-4px',
        }}
        _hover={{ backgroundColor: token('colors.accent.background-secondary') }}
        // // #4164 FIXME migrate - not sure if this 'as' matters - if so refactor
        // as={onClickLayout ? 'button' : 'div'}
        borderRadius="20px"
        onClick={onClickLayout}
        padding="4px"
        style={{
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
        <Stack mt="space.04" pl="space.02" gap="space.01" textAlign="left">
          <styled.span
            color={token('colors.accent.text-primary')}
            fontWeight="500"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            width="95%"
          >
            {title}
          </styled.span>
          <styled.span color={token('colors.accent.text-subdued')} fontSize={1}>
            {subtitle}
          </styled.span>
        </Stack>

        {onClickSend ? (
          <Box padding="8px">
            <LeatherButton
              variant="ghost"
              // #4164 FIXME migrate - check tertiary buttons
              // mode="tertiary"
              p="6px 12px"
              style={{
                clipPath: isHovered ? 'none' : 'circle(0%)',
              }}
              onClick={e => {
                e.stopPropagation();
                onClickSend();
              }}
              _focus={{ clipPath: 'none', outline: `4px solid ${figmaTheme.borderFocused}` }}
            >
              Send
            </LeatherButton>
          </Box>
        ) : (
          <Box padding="4px" />
        )}
      </Box>
    </Box>
  );
}
