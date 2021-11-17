import React, { Dispatch, SetStateAction, useMemo, useRef } from 'react';
import { color, Fade, Stack } from '@stacks/ui';

import { useOnClickOutside } from '@common/hooks/use-onclickoutside';
import { FeeEstimation } from '@models/fees-types';

import { FeeEstimateItem } from './fee-estimate-item';

interface FeeEstimateSelectProps {
  isOpen: boolean;
  feeEstimations: FeeEstimation[];
  onClick: (index: number) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function FeeEstimateSelect(props: FeeEstimateSelectProps) {
  const { feeEstimations, isOpen, onClick, setIsOpen } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const feeEstimationsListItems = useMemo(() => {
    return [
      { label: '' },
      { label: 'Low', ...feeEstimations[0] },
      { label: 'Standard', ...feeEstimations[1] },
      { label: 'High', ...feeEstimations[2] },
      { label: 'Custom' },
    ];
  }, [feeEstimations]);

  return (
    <Fade in={isOpen}>
      {styles => (
        <Stack
          bg={color('bg')}
          borderRadius="8px"
          boxShadow="high"
          flexDirection="column"
          minHeight="96px"
          minWidth="100px"
          overflow="hidden"
          p="extra-tight"
          position="absolute"
          ref={ref}
          style={styles}
          top="-64px"
          zIndex={9999}
        >
          {feeEstimationsListItems.map((item, index) => (
            <FeeEstimateItem
              index={index}
              isSelectActive={isOpen}
              key={item.label}
              label={item.label}
              onClick={onClick}
            />
          ))}
        </Stack>
      )}
    </Fade>
  );
}
