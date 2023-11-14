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
  console.log(index, testLabels[index]);
  return (
    <LeatherButton
      alignItems="center"
      data-testid={`recipient-select-field-${testLabels[index]}`}
      display="flex"
      height="32px"
      mb="0px !important"
      minWidth="110px"
      onClick={() => onSelectItem(index)}
      pl={isVisible ? 'space.02' : 'unset'}
      variant="text"
    >
      <HStack gap="space.01">
        <styled.span textStyle="label.03">{labels[index]}</styled.span>
        {isVisible ? <></> : <ChevronDownIcon />}
      </HStack>
    </LeatherButton>
  );
}
