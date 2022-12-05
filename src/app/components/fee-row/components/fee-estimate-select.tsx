import { Dispatch, SetStateAction, useRef } from 'react';

import { Fade, Stack, color } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';

import { StacksFeeEstimateLegacy } from '@shared/models/fees/_fees-legacy.model';
import { FeeTypes } from '@shared/models/fees/_fees.model';

import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';

import { FeeEstimateItem } from './fee-estimate-item';

interface FeeEstimateSelectProps {
  items: StacksFeeEstimateLegacy[];
  onClick: (index: number) => void;
  selected: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}
export function FeeEstimateSelect(props: FeeEstimateSelectProps) {
  const { items, onClick, selected, setIsOpen, visible } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <Fade in={visible}>
      {styles => (
        <Stack
          bg={color('bg')}
          borderRadius="8px"
          boxShadow="high"
          data-testid={SendFormSelectors.FeeEstimateSelect}
          flexDirection="column"
          minHeight="96px"
          minWidth="100px"
          overflow="hidden"
          p="extra-tight"
          position="absolute"
          ref={ref}
          style={styles}
          top="-100px"
          zIndex={9999}
        >
          {items.map((item, index) => (
            <FeeEstimateItem
              index={index}
              key={item.fee}
              onClick={onClick}
              selected={selected}
              visible
            />
          ))}
          <FeeEstimateItem index={FeeTypes.Custom} onClick={onClick} selected={selected} visible />
        </Stack>
      )}
    </Fade>
  );
}
