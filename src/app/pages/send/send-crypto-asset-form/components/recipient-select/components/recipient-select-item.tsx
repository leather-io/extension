import { FiChevronDown } from 'react-icons/fi';

import { Box, Text, color } from '@stacks/ui';

const labels = ['Address', 'BNS Name'];
const testLabels = ['address', 'bns-name'];

interface RecipientSelectItemProps {
  index: number;
  isVisible?: boolean;
  onSelectItem(index: number): void;
}
export function RecipientSelectItem(props: RecipientSelectItemProps) {
  const { index, isVisible, onSelectItem } = props;

  return (
    <Box
      _hover={{ bg: isVisible ? color('bg-alt') : 'none', borderRadius: '8px' }}
      alignItems="center"
      as="button"
      bg={color('bg')}
      data-testid={`recipient-select-field-${testLabels[index]}`}
      display="flex"
      height="32px"
      mb="0px !important"
      minWidth="110px"
      onClick={() => onSelectItem(index)}
      pl={isVisible ? 'tight' : 'unset'}
      type="button"
    >
      <Text
        color={isVisible ? color('text-body') : color('accent')}
        fontSize={1}
        fontWeight={isVisible ? 400 : 500}
        ml="2px"
        mr="tight"
      >
        {labels[index]}
      </Text>
      {isVisible ? <></> : <FiChevronDown color={color('accent')} />}
    </Box>
  );
}
