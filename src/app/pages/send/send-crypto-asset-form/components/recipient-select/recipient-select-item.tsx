import { FiChevronDown } from 'react-icons/fi';

import { Box, Text, color } from '@stacks/ui';

const labels = ['Address', 'BNS Name'];

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
      display="flex"
      height="32px"
      mb="0px !important"
      minWidth="110px"
      onClick={() => onSelectItem(index)}
      pl={isVisible ? 'tight' : 'unset'}
      type="button"
    >
      <Text color={color('text-caption')} fontSize={1} fontWeight={500} ml="2px" mr="tight">
        {labels[index]}
      </Text>
      {isVisible ? <></> : <FiChevronDown />}
    </Box>
  );
}
