import { HStack, styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/ui/components/button';
import { ChevronDownIcon } from '@app/ui/components/icons/chevron-down-icon';

const labels = ['Address', 'BNS Name'];
const testLabels = ['address', 'bns-name'];

interface RecipientDropdownItemProps {
  index: number;
  isVisible?: boolean;
  onSelectItem(index: number): void;
}
export function RecipientDropdownItem({
  index,
  isVisible,
  onSelectItem,
}: RecipientDropdownItemProps) {
  return (
    <LeatherButton
      _hover={{
        bg: isVisible ? 'accent.component-background-hover' : 'accent.background-primary',
        borderRadius: 'xs',
        color: 'accent.text-primary',
      }}
      alignItems="center"
      data-testid={`recipient-select-field-${testLabels[index]}`}
      display="flex"
      height="30px"
      minWidth="110px"
      onClick={() => onSelectItem(index)}
      pl={isVisible ? 'space.02' : 'unset'}
      variant="text"
    >
      <HStack gap="space.01">
        <styled.span textStyle="label.02">{labels[index]}</styled.span>
        {isVisible ? <></> : <ChevronDownIcon />}
      </HStack>
    </LeatherButton>
  );
}
