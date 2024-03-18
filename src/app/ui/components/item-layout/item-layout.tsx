import { ReactNode, isValidElement } from 'react';

import { Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import { pressableCaptionStyles, pressableChevronStyles } from '@app/ui/pressable/pressable';

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
    <Flag spacing="space.03" {...props}>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Stack
          alignItems="start"
          gap="2px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          <HStack gap="space.01">
            {isValidElement(titleLeft) ? (
              titleLeft
            ) : (
              <styled.span fontWeight={500} textStyle="label.03">
                {titleLeft}
              </styled.span>
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
          <Stack alignItems="end" gap="2px">
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
