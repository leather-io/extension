import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Stack } from 'leather-styles/jsx';

import { Button, ItemLayout } from '@leather.io/ui';

import type { FeeType } from '@app/common/fees/use-fees';

import { FormError } from '../error/form-error';
import { FeeItemIcon } from './fee-item-icon';

export interface FeeItemProps {
  feeType: FeeType;
  isSelected: boolean;
  isInsufficientBalance: boolean;
  onSelect(feeType: FeeType): void;
  titleLeft: string;
  captionLeft: string;
  titleRight?: string;
  captionRight?: string;
}

export function FeeItem({
  feeType,
  onSelect,
  isInsufficientBalance,
  isSelected,
  titleLeft,
  captionLeft,
  titleRight,
  captionRight,
}: FeeItemProps) {
  const [isTouched, setIsTouched] = useState(false);
  const showInsufficientBalanceError = isTouched && isInsufficientBalance;

  return (
    <Button
      onClick={() => {
        setIsTouched(true);

        if (isInsufficientBalance) return;

        onSelect(feeType);
      }}
      key={feeType}
      variant="outline"
      opacity={isInsufficientBalance ? 0.5 : 1}
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={
        isSelected && !isInsufficientBalance ? 'ink.border-selected' : 'ink.border-default'
      }
      // Add margin compensation when not selected to maintain consistent size
      margin={isSelected ? '0px' : '1px'}
    >
      <Stack gap="0">
        <ItemLayout
          img={<FeeItemIcon feeType={feeType} />}
          titleLeft={titleLeft}
          captionLeft={captionLeft}
          titleRight={titleRight}
          captionRight={captionRight}
        />
        <AnimatePresence>
          {showInsufficientBalanceError && (
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
            >
              <FormError text="Available balance insufficient" />
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Button>
  );
}
