import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Stack } from 'leather-styles/jsx';

import { Button, ItemLayout } from '@leather.io/ui';

import { FormError } from '@app/components/error/form-error';

import { type Fee, useFeeEditorContext } from '../fee-editor.context';
import { formatFeeItem } from '../fee-editor.utils';
import { FeeItemIcon } from './fee-item-icon';

interface FeeItemProps {
  fee: Fee;
}
export function FeeItem({ fee }: FeeItemProps) {
  const [isTouched, setIsTouched] = useState(false);
  const { availableBalance, marketData, onSetSelectedFee, selectedFee } = useFeeEditorContext();

  const { titleLeft, captionLeft, titleRight, captionRight } = formatFeeItem({
    fee,
    marketData,
  });

  const isSelected = selectedFee?.type === fee.type;
  const isInsufficientBalance = availableBalance.amount.isLessThan(
    selectedFee?.feeValue?.amount ?? 0
  );
  const showInsufficientBalanceError = isTouched && isInsufficientBalance;

  return (
    <Button
      onClick={() => {
        setIsTouched(true);
        if (isInsufficientBalance) return;
        onSetSelectedFee(fee);
      }}
      key={fee.type}
      variant="outline"
      opacity={isInsufficientBalance ? 0.5 : 1}
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={
        isSelected && !isInsufficientBalance ? 'ink.border-selected' : 'ink.border-default'
      }
      // Add margin compensation to maintain consistent size
      margin={isSelected ? '0px' : '1px'}
    >
      <Stack gap="0">
        <ItemLayout
          img={<FeeItemIcon feeType={fee.type} />}
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
