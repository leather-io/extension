import { ReactNode, useRef } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Stack } from 'leather-styles/jsx';

import { FeeTypes } from '@leather.io/models';

import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';

import { FeeEstimateItem } from './fee-estimate-item';

interface FeeEstimateSelectLayoutProps {
  children: ReactNode;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
  disableFeeSelection?: boolean;
  isVisible?: boolean;
}
export function FeeEstimateSelectLayout({
  children,
  onSetIsSelectVisible,
  selectedItem,
  disableFeeSelection,
  isVisible,
}: FeeEstimateSelectLayoutProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => onSetIsSelectVisible(false));

  return (
    <>
      <Stack _hover={{ cursor: disableFeeSelection ? 'default' : 'pointer' }}>
        <FeeEstimateItem
          disableFeeSelection={disableFeeSelection}
          index={selectedItem}
          isVisible={isVisible}
          onSelectItem={() => onSetIsSelectVisible(true)}
          selectedItem={FeeTypes.Middle}
        />
        {isVisible ? (
          <Stack
            bg="ink.background-primary"
            borderRadius="xs"
            boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08)"
            data-testid={SharedComponentsSelectors.FeeEstimateSelect}
            flexDirection="column"
            gap="0px"
            minHeight="96px"
            minWidth="100px"
            overflow="hidden"
            p="space.01"
            position="absolute"
            ref={ref}
            top="-45px"
            zIndex={9999}
          >
            {children}
          </Stack>
        ) : null}
      </Stack>
    </>
  );
}
