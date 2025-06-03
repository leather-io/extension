import { ReactNode } from 'react';

import { Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import { Flag, pressableCaptionStyles } from '@leather.io/ui';

interface ItemWithButtonsLayoutProps {
  buttons: ReactNode;
  caption: string;
  img: ReactNode;
  title: string;
}
// TODO: Fix in UI lib - Flag needs width 100% here to fix the receive modal
export function ItemLayoutWithButtons({
  buttons,
  caption,
  img,
  title,
}: ItemWithButtonsLayoutProps) {
  return (
    <Flag img={img} alignItems="center" width="100%">
      <Flex alignItems="center" justifyContent="space-between">
        <Stack
          alignItems="start"
          flexGrow={2}
          gap="2px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          <styled.span textStyle="label.02">{title}</styled.span>
          <styled.span className={pressableCaptionStyles} textStyle="caption.01">
            {caption}
          </styled.span>
        </Stack>
        <HStack alignItems="end" gap="space.00">
          {buttons}
        </HStack>
      </Flex>
    </Flag>
  );
}
