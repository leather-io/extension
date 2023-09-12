import { ReactNode, useRef } from 'react';
import { FiInfo } from 'react-icons/fi';

import { Box, Fade, Stack, Tooltip, color } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { FeeTypes } from '@shared/models/fees/fees.model';

import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { FeeEstimateItem } from './fee-estimate-item';

const feesInfo =
  'Higher fees increase the likelihood of your transaction getting confirmed before others. Click to learn more.';
const url = 'https://hiro.so/questions/fee-estimates';

interface FeeEstimateSelectLayoutProps {
  children: ReactNode;
  isVisible: boolean;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
  disableFeeSelection: boolean;
}
export function FeeEstimateSelectLayout(props: FeeEstimateSelectLayoutProps) {
  const { children, isVisible, onSetIsSelectVisible, selectedItem, disableFeeSelection } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => onSetIsSelectVisible(false));

  return (
    <>
      <Stack _hover={{ cursor: disableFeeSelection ? 'default' : 'pointer' }}>
        <FeeEstimateItem
          disableFeeSelection={disableFeeSelection}
          index={selectedItem}
          onSelectItem={() => onSetIsSelectVisible(true)}
          selectedItem={FeeTypes.Middle}
        />
        <Fade in={isVisible}>
          {styles => (
            <Stack
              bg={color('bg')}
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
              style={styles}
              top="-35px"
              zIndex={9999}
            >
              {children}
            </Stack>
          )}
        </Fade>
      </Stack>
      <Tooltip label={feesInfo} placement="bottom">
        <Stack>
          <Box
            _hover={{ cursor: 'pointer' }}
            as={FiInfo}
            color={color('text-caption')}
            onClick={() => openInNewTab(url)}
            size="14px"
          />
        </Stack>
      </Tooltip>
    </>
  );
}
