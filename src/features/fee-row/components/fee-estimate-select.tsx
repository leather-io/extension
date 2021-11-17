import React, { Dispatch, SetStateAction, useRef } from 'react';
import { color, Fade, Stack } from '@stacks/ui';

import { useOnClickOutside } from '@common/hooks/use-onclickoutside';
import { Estimations, FeeEstimation } from '@models/fees-types';

import { FeeEstimateItem } from './fee-estimate-item';

interface FeeEstimateSelectProps {
  items: FeeEstimation[];
  onClick: (index: number) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}

export function FeeEstimateSelect(props: FeeEstimateSelectProps) {
  const { items, onClick, setIsOpen, visible } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <Fade in={visible}>
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
          top="-32px"
          zIndex={9999}
        >
          {items.map((item, index) => (
            <FeeEstimateItem index={index} key={item.fee} onClick={onClick} visible />
          ))}
          <FeeEstimateItem index={Estimations.Custom} onClick={onClick} visible />
        </Stack>
      )}
    </Fade>
  );
}
