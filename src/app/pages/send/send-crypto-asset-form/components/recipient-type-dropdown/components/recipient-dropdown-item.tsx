import { color } from '@stacks/ui-utils';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { ChevronDownIcon } from '@app/components/icons/chevron-down-icon';

const labels = ['Address', 'BNS Name'];
const testLabels = ['address', 'bns-name'];

interface RecipientDropdownItemProps {
  index: number;
  isVisible?: boolean;
  onSelectItem(index: number): void;
}
export function RecipientDropdownItem(props: RecipientDropdownItemProps) {
  const { index, isVisible, onSelectItem } = props;

  return (
    <styled.button
      _hover={{ bg: isVisible ? color('bg-alt') : 'none', borderRadius: '8px' }}
      alignItems="center"
      data-testid={`recipient-select-field-${testLabels[index]}`}
      display="flex"
      height="32px"
      mb="0px !important"
      minWidth="110px"
      onClick={() => onSelectItem(index)}
      pl={isVisible ? 'space.02' : 'unset'}
      type="button"
    >
      <styled.span
        color={isVisible ? color('text-body') : token('colors.brown.12')}
        fontSize={1}
        fontWeight={isVisible ? 400 : 500}
        ml="2px"
        mr="space.02"
      >
        {labels[index]}
      </styled.span>
      {/* TODO - check if color needs to be passed to icon */}
      {isVisible ? <></> : <ChevronDownIcon color={token('colors.brown.12')} />}
    </styled.button>
  );
}
