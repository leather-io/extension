import { ReactNode, isValidElement } from 'react';

import { Box, Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import {
  pressableCaptionStyles,
  pressableChevronStyles,
} from '@app/ui/components/pressable/pressable';

import { CheckmarkIcon } from '../../icons/checkmark-icon';
import { ChevronUpIcon } from '../../icons/chevron-up-icon';
import { Flag, type FlagProps } from '../flag/flag';

interface ItemLayoutProps extends Omit<FlagProps, 'children'> {
  captionLeft: ReactNode;
  captionRight?: ReactNode;
  img: ReactNode;
  isDisabled?: boolean;
  isSelected?: boolean;
  showChevron?: boolean;
  titleLeft: ReactNode;
  titleRight: ReactNode;
}
export function ItemLayout({
  captionLeft,
  captionRight,
  img,
  isSelected,
  showChevron,
  titleLeft,
  titleRight,
  ...props
}: ItemLayoutProps) {
  return (
    <Flag img={img} spacing="space.03" {...props}>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Stack
          alignItems="start"
          flexGrow={2}
          gap="2px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          <HStack gap="space.01">
            {isValidElement(titleLeft) ? (
              titleLeft
            ) : (
              <styled.span textStyle="label.02">{titleLeft}</styled.span>
            )}
            {isSelected && (
              <Box height="20px">
                <CheckmarkIcon variant="small" />
              </Box>
            )}
          </HStack>
          {isValidElement(captionLeft) ? (
            captionLeft
          ) : (
            <styled.span className={pressableCaptionStyles} textStyle="caption.01">
              {captionLeft}
            </styled.span>
          )}
        </Stack>
        <HStack gap="space.03">
          <Stack alignItems="end" gap="2px" height="42px">
            {isValidElement(titleRight) ? (
              titleRight
            ) : (
              <styled.span textStyle="label.02">{titleRight}</styled.span>
            )}
            {isValidElement(captionRight) ? (
              captionRight
            ) : (
              <styled.span className={pressableCaptionStyles} textStyle="caption.01">
                {captionRight}
              </styled.span>
            )}
          </Stack>
          {showChevron && (
            <ChevronUpIcon
              color={pressableChevronStyles}
              transform="rotate(90deg)"
              variant="small"
            />
          )}
        </HStack>
      </Flex>
    </Flag>
  );
}
