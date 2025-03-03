import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Stack } from 'leather-styles/jsx';

import { Button, ItemLayout } from '@leather.io/ui';

import { FormError } from '@app/components/error/form-error';

import { type EditorFee, useFeeEditorContext } from '../fee-editor.context';
import { formatEditorFeeItem } from '../fee-editor.utils';
import { FeeItemIcon } from './fee-item-icon';

interface FeeItemProps {
  fee: EditorFee;
}
export function FeeItem({ fee }: FeeItemProps) {
  const [isTouched, setIsTouched] = useState(false);
  const { availableBalance, marketData, onSetSelectedEditorFee, selectedEditorFee } =
    useFeeEditorContext();

  const { titleLeft, captionLeft, titleRight, captionRight } = formatEditorFeeItem({
    editorFee: fee,
    marketData,
  });

  const isSelected = selectedEditorFee?.type === fee.type;
  const isInsufficientBalance = availableBalance.amount.isLessThan(
    selectedEditorFee?.feeValue?.amount ?? 0
  );
  const showInsufficientBalanceError = isTouched && isInsufficientBalance;

  return (
    <Button
      onClick={() => {
        setIsTouched(true);
        if (isInsufficientBalance) return;
        onSetSelectedEditorFee(fee);
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
