import { ReactNode, useRef } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Stack } from 'leather-styles/jsx';

import { FeeTypes } from '@shared/models/fees/fees.model';

import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Tooltip } from '@app/components/tooltip';
import { InfoIcon } from '@app/ui/components/icons/info-icon';

import { FeeEstimateItem } from './fee-estimate-item';

const feesInfo =
  'Higher fees increase the likelihood of your transaction getting confirmed before others. Click to learn more.';
const url = 'https://hiro.so/questions/fee-estimates';

interface FeeEstimateSelectLayoutProps {
  children: ReactNode;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
  disableFeeSelection?: boolean;
  isVisible?: boolean;
  onSelectItem(index: number): void;
}

// #4476 TODO test well as a few changes
export function FeeEstimateSelectLayout({
  children,
  onSetIsSelectVisible,
  selectedItem,
  disableFeeSelection,
  isVisible,
  onSelectItem,
}: FeeEstimateSelectLayoutProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => onSetIsSelectVisible(false));

  return (
    <>
      <Stack _hover={{ cursor: disableFeeSelection ? 'default' : 'pointer' }}>
        <FeeEstimateItem
          disableFeeSelection={disableFeeSelection}
          index={selectedItem}
          selectedItem={FeeTypes.Middle}
          isVisible={isVisible}
          onSelectItem={onSelectItem}
        />
        <Stack
          bg="accent.background-primary"
          borderRadius="8px"
          boxShadow="high"
          data-testid={SharedComponentsSelectors.FeeEstimateSelect}
          flexDirection="column"
          minHeight="96px"
          minWidth="100px"
          overflow="hidden"
          p="extra-tight"
          position="absolute"
          ref={ref}
          top="-35px"
          zIndex={9999}
        >
          {children}
        </Stack>
      </Stack>
      <Tooltip label={feesInfo} placement="bottom">
        <Stack>
          <InfoIcon
            size="icon.xs"
            ml="space.01"
            color="accent.text-subdued"
            onClick={() => openInNewTab(url)}
          />
        </Stack>
      </Tooltip>
    </>
  );
}
