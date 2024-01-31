import { ReactNode, isValidElement } from 'react';

import { Flex, HStack, Stack, styled } from 'leather-styles/jsx';

import { CheckmarkIcon } from '../../icons/checkmark-icon';
import { ChevronUpIcon } from '../../icons/chevron-up-icon';
import { Flag } from '../flag/flag';
import { itemCaptionStyles, itemChevronStyles } from './item-interactive';

interface ItemLayoutProps {
  captionLeft: ReactNode;
  captionRight?: ReactNode;
  flagImg: ReactNode;
  isDisabled?: boolean;
  isSelected?: boolean;
  showChevron?: boolean;
  titleLeft: ReactNode;
  titleRight: ReactNode;
}
export function ItemLayout({
  captionLeft,
  captionRight,
  flagImg,
  isSelected,
  showChevron,
  titleLeft,
  titleRight,
}: ItemLayoutProps) {
  return (
    <Flag img={flagImg} spacing="space.03">
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
              <styled.span fontWeight={500} textStyle="label.02">
                {titleLeft}
              </styled.span>
            )}
            {isSelected && <CheckmarkIcon />}
          </HStack>
          {isValidElement(captionLeft) ? (
            captionLeft
          ) : (
            <styled.span className={itemCaptionStyles} textStyle="caption.01">
              {captionLeft}
            </styled.span>
          )}
        </Stack>
        <HStack gap="space.03">
          <Stack alignItems="end" gap="2px" height="42px">
            {isValidElement(titleRight) ? (
              titleRight
            ) : (
              <styled.span fontWeight={500} textStyle="label.02">
                {titleRight}
              </styled.span>
            )}
            {isValidElement(captionRight) ? (
              captionRight
            ) : (
              <styled.span className={itemCaptionStyles} textStyle="caption.02">
                {captionRight}
              </styled.span>
            )}
          </Stack>
          {showChevron && <ChevronUpIcon color={itemChevronStyles} transform="rotate(90deg)" />}
        </HStack>
      </Flex>
    </Flag>
  );
}
