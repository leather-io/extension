import { FiChevronDown } from 'react-icons/fi';
import { color, Stack } from '@stacks/ui';

import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';

const labels = ['Low', 'Standard', 'High', 'Custom'];
const testLabels = labels.map(label => label.toLowerCase());

interface FeeEstimateItemProps {
  index: number;
  onClick: (index: number) => void;
  selected?: number;
  visible?: boolean;
}
export function FeeEstimateItem(props: FeeEstimateItemProps) {
  const { index, onClick, visible } = props;

  return (
    <Stack
      alignItems="center"
      border={visible ? 'none' : '1px solid #EFEFF2'}
      borderRadius={visible ? '0px' : '10px'}
      bg={color('bg')}
      data-testid={`${testLabels[index]}-fee`}
      _hover={{ bg: visible ? color('bg-alt') : 'none', borderRadius: '8px' }}
      height="32px"
      isInline
      minWidth="100px"
      p="tight"
      mb="0px !important"
      onClick={() => onClick(index)}
    >
      <SpaceBetween flexGrow={1}>
        <Caption ml="2px">{labels[index]}</Caption>
        {visible ? <></> : <FiChevronDown />}
      </SpaceBetween>
    </Stack>
  );
}
