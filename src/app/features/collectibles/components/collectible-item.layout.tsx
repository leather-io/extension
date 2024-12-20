import { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Box, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useHoverWithChildren } from '@app/common/hooks/use-hover-with-children';

import { CollectibleHover } from './collectible-hover';

export interface CollectibleItemLayoutProps {
  children: ReactNode;
  hoverText?: string;
  onClickCallToAction?(): void;
  onClickLayout?(): void;
  onClickSend?(): void;
  collectibleTypeIcon?: ReactNode;
  showBorder?: boolean;
  subtitle: string;
  title: string;
}
export function CollectibleItemLayout({
  children,
  onClickCallToAction,
  onClickSend,
  onClickLayout,
  collectibleTypeIcon,
  showBorder,
  subtitle,
  title,
  ...rest
}: CollectibleItemLayoutProps) {
  const [isHovered, bind] = useHoverWithChildren();

  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <Box
      ref={ref}
      _focus={{
        outline: onClickLayout ? 'focus' : 'unset',
        outlineOffset: onClickLayout ? '-4px' : 'unset',
      }}
      _hover={{ bg: 'ink.background-secondary' }}
      borderRadius="xs"
      cursor={onClickLayout ? 'pointer' : 'default'}
      onClick={onClickLayout}
      p="space.01"
      textAlign="inherit"
      width="100%"
      {...rest}
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
          borderRadius="xs"
          display="flex"
          height="100%"
          justifyContent="center"
          left="0px"
          overflow="hidden"
          position="absolute"
          style={{
            backgroundColor: showBorder
              ? token('colors.ink.background-primary')
              : token('colors.ink.component-background-default'),
            border: showBorder ? token('borders.dashed') : 'unset',
          }}
          top="0px"
          width="100%"
        >
          {inView ? children : null}
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
        <styled.span color="ink.text-subdued" textStyle="caption.01">
          {subtitle}
        </styled.span>
      </Stack>
      {onClickSend ? (
        <Box p="space.02">
          <styled.button
            data-testid={SendCryptoAssetSelectors.InscriptionSendButton}
            _focus={{ clipPath: 'none', outline: 'focus' }}
            _hover={{ bg: 'ink.background-primary' }}
            bg="ink.background-primary"
            borderRadius="xs"
            clipPath={isHovered ? 'none' : 'circle(0%)'}
            fontWeight={500}
            onClick={e => {
              e.stopPropagation();
              onClickSend();
            }}
            px="space.03"
            py="space.02"
            textStyle="caption.01"
            type="button"
          >
            Send
          </styled.button>
        </Box>
      ) : (
        <Box p="space.01" />
      )}
    </Box>
  );
}
