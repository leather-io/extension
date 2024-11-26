import { useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Box, Stack, styled } from 'leather-styles/jsx';

import {
  AnimalChameleonIcon,
  AnimalEagleIcon,
  AnimalRabbitIcon,
  AnimalSnailIcon,
  ArrowRotateClockwiseIcon,
  Button,
  Input,
  ItemLayout,
  Pressable,
  Title,
} from '@leather.io/ui';

import type { Fee, FeeType } from '@app/pages/rpc-send-transfer/rpc-send-transfer-container';

interface FeesProps {
  feesList: Fee[];
  editFeeSelected: FeeType;
  setEditFeeSelected(feeType: FeeType): void;
  availableBalance: number;

  customFeeRate: string | null;
  setCustomFeeRate(feeRate: string | null): void;

  customFeeData: Fee | null;
}

export function ApproverIconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      width="40px"
      height="40px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="100%"
      background="ink.component-background-hover"
      border="1px solid"
      borderColor="ink.component-background-hover"
      p="space.02"
    >
      {children}
    </Box>
  );
}

export function FeeItemIcon({ feeType }: { feeType: FeeType }) {
  function getIcon() {
    if (feeType === 'slow') return <AnimalSnailIcon variant="small" />;
    if (feeType === 'standard') return <AnimalRabbitIcon variant="small" />;
    if (feeType === 'fast') return <AnimalEagleIcon variant="small" />;
    if (feeType === 'custom') return <AnimalChameleonIcon variant="small" />;

    throw new Error('Invalid fee type');
  }

  return <ApproverIconWrapper>{getIcon()}</ApproverIconWrapper>;
}

export function Fees({
  feesList,
  editFeeSelected,
  setEditFeeSelected,
  availableBalance,

  customFeeRate,
  setCustomFeeRate,

  customFeeData,
}: FeesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [touchedFees, setTouchedFees] = useState<Set<FeeType>>(new Set()); // Add this state

  return (
    <Stack gap="space.03">
      {feesList.map(
        ({ feeType, titleLeft, captionLeft, titleRight, captionRight, baseUnitsValue }, index) => {
          const titleLeftElement = (
            <Title
              overflow="hidden"
              textOverflow="ellipsis"
              textStyle="label.02"
              whiteSpace="nowrap"
            >
              {titleLeft}
            </Title>
          );

          const isSelected = editFeeSelected === feeType;
          const isInsufficientBalance = availableBalance < baseUnitsValue;
          const isTouched = touchedFees.has(feeType);

          const showInsufficientBalanceError = isTouched && isInsufficientBalance;
          return (
            <Button
              onClick={() => {
                setTouchedFees(prev => new Set([...prev, feeType]));

                if (isInsufficientBalance) return;
                setEditFeeSelected(feeType);
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
                  titleLeft={titleLeftElement}
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
                      <Box
                        mt="space.02"
                        border="1px solid"
                        background="red.background-primary"
                        borderColor="red.border"
                        color="red.action-primary-default"
                        textStyle="caption.01"
                      >
                        <styled.span textStyle="label.03">
                          Available balance insufficient
                        </styled.span>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>
            </Button>
          );
        }
      )}

      <Button
        onClick={() => setEditFeeSelected('custom')}
        variant="outline"
        borderWidth={editFeeSelected === 'custom' ? '2px' : '1px'}
        borderColor={editFeeSelected === 'custom' ? 'ink.border-selected' : 'ink.border-default'}
        // Add margin compensation when not selected to maintain consistent size
        margin={editFeeSelected === 'custom' ? '0px' : '1px'}
      >
        <ItemLayout
          img={<FeeItemIcon feeType="custom" />}
          titleLeft={'Custom'}
          captionLeft={customFeeData?.captionLeft}
          titleRight={customFeeData?.titleRight}
          captionRight={customFeeData?.captionRight}
        />
        <AnimatePresence>
          {editFeeSelected === 'custom' && (
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
                    onChange={e => setCustomFeeRate(e.target.value)}
                    value={customFeeRate ?? ''}
                  />
                </Input.Root>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </Stack>
  );
}
