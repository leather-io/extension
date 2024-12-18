import { useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Stack } from 'leather-styles/jsx';

import { Button, Input, ItemLayout } from '@leather.io/ui';

import type { FeeItemProps } from './fee-item';
import { FeeItemIcon } from './fee-item-icon';

interface CustomFeeItemProps extends FeeItemProps {
  fee: string | null;
  setFee(fee: string): void;
}

export function CustomFeeItem({
  fee,
  setFee,
  feeType,
  onSelect,
  isSelected,
  captionLeft,
  titleRight,
  captionRight,
}: CustomFeeItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      onClick={() => onSelect(feeType)}
      variant="outline"
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'ink.border-selected' : 'ink.border-default'}
      // Add margin compensation when not selected to maintain consistent size
      margin={isSelected ? '0px' : '1px'}
    >
      <ItemLayout
        img={<FeeItemIcon feeType="custom" />}
        titleLeft="Custom"
        captionLeft={captionLeft}
        titleRight={titleRight}
        captionRight={captionRight}
      />
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              type: 'spring',
              duration: 0.3,
              bounce: 0,
              opacity: { duration: 0.2 },
            }}
            onAnimationComplete={() => {
              inputRef.current?.focus();
            }}
          >
            <Stack pt="space.02">
              <Input.Root style={{ minHeight: '40px' }}>
                <Input.Field
                  ref={inputRef}
                  onChange={e => setFee(e.target.value)}
                  value={fee ?? ''}
                />
              </Input.Root>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
