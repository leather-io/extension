import { HStack, styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { ChevronDownIcon } from '@app/ui/components/icons/chevron-down-icon';

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
    <LeatherButton
      alignItems="center"
      data-testid={`recipient-select-field-${testLabels[index]}`}
      display="flex"
      height="32px"
      mb="0px !important"
      minWidth="110px"
      onClick={() => onSelectItem(index)}
      pl={isVisible ? 'tight' : 'unset'}
      variant="text"
    >
      <HStack gap="space.01">
        <styled.span textStyle="label.03">{labels[index]}</styled.span>
        {isVisible ? <></> : <ChevronDownIcon />}
      </HStack>
    </LeatherButton>
  );
}
