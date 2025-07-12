import { Circle, HStack } from 'leather-styles/jsx';

import { ArrowLeftIcon, IconButton } from '@leather.io/ui';

const activeWidth = '16px';
const inactiveWidth = '4px';
const activeColor = 'currentColor';
const inactiveColor = 'ink.text-non-interactive';

interface PromoBannerNavbarProps {
  currentIndex: number;
  promoIndexes: number[];
  visibleIndexes: number[];
  onSetCurrentIndex(index: number): void;
  onGoBackward(): void;
  onGoForward(): void;
}
export function PromoBannerNavbar({
  currentIndex,
  promoIndexes,
  visibleIndexes,
  onSetCurrentIndex,
  onGoBackward,
  onGoForward,
}: PromoBannerNavbarProps) {
  return (
    <HStack justify="space-between">
      <IconButton
        _disabled={{ visibility: 'hidden' }}
        _hover={{ bg: 'transparent' }}
        disabled={currentIndex === 0 || visibleIndexes.length === 1}
        icon={<ArrowLeftIcon variant="small" />}
        onClick={onGoBackward}
      />
      <HStack>
        {visibleIndexes.map(index => (
          <Circle
            key={index}
            cursor="pointer"
            bg={index === currentIndex ? activeColor : inactiveColor}
            width={index === currentIndex ? activeWidth : inactiveWidth}
            height="4px"
            onClick={() => onSetCurrentIndex(index)}
          />
        ))}
      </HStack>
      <IconButton
        _disabled={{ visibility: 'hidden' }}
        _hover={{ bg: 'transparent' }}
        disabled={currentIndex === promoIndexes.length - 1 || visibleIndexes.length === 1}
        icon={<ArrowLeftIcon variant="small" />}
        transform="rotate(180deg)"
        onClick={onGoForward}
      />
    </HStack>
  );
}
