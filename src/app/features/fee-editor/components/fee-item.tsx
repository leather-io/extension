import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Stack } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

import { FormError } from '@app/components/form-error';

import { type Fee, useFeeEditorContext } from '../fee-editor.context';
import { FeeRateItemLayout } from './fee-rate-item.layout';
import { FeeValueItemLayout } from './fee-value-item.layout';

interface FeeItemProps {
  fee: Fee;
}
export function FeeItem({ fee }: FeeItemProps) {
  const [isTouched, setIsTouched] = useState(false);
  const { availableBalance, feeType, marketData, onSetSelectedFee, selectedFee } =
    useFeeEditorContext();

  const isSelected = selectedFee?.priority === fee.priority;
  const isInsufficientBalance = availableBalance.amount.isLessThan(selectedFee?.txFee?.amount ?? 0);
  const showInsufficientBalanceError = isTouched && isInsufficientBalance;

  return (
    <Button
      onClick={() => {
        setIsTouched(true);
        if (isInsufficientBalance) return;
        onSetSelectedFee(fee);
      }}
      key={fee.priority}
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
        {feeType === 'fee-rate' ? <FeeRateItemLayout fee={fee} marketData={marketData} /> : null}
        {feeType === 'fee-value' ? <FeeValueItemLayout fee={fee} marketData={marketData} /> : null}
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
