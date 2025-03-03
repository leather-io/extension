import { useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Stack } from 'leather-styles/jsx';

import { Button, Input, ItemLayout } from '@leather.io/ui';

import { type EditorFee, useFeeEditorContext } from '../fee-editor.context';
import { formatEditorFeeItem } from '../fee-editor.utils';
import { FeeItemIcon } from './fee-item-icon';

interface CustomFeeItemProps {
  fee: EditorFee;
}
export function CustomFeeItem({ fee }: CustomFeeItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    customEditorFeeRate,
    marketData,
    selectedEditorFee,
    onSetCustomEditorFeeRate,
    onSetSelectedEditorFee,
  } = useFeeEditorContext();

  const { captionLeft, titleRight, captionRight } = formatEditorFeeItem({
    editorFee: fee,
    marketData,
  });

  const isSelected = selectedEditorFee?.type === fee.type;

  return (
    <Button
      onClick={() => onSetSelectedEditorFee(fee)}
      variant="outline"
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'ink.border-selected' : 'ink.border-default'}
      // Add margin compensation to maintain consistent size
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
                  onChange={e => onSetCustomEditorFeeRate(e.target.value)}
                  placeholder="0"
                  value={customEditorFeeRate ?? ''}
                />
              </Input.Root>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
