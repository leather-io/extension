import type { Entries } from '@shared/utils/type-utils';

import { DropdownMenu } from '@app/ui/components/dowpdown-menu/dropdown-menu';
import { Flag } from '@app/ui/components/flag/flag';
import { ChevronDownIcon } from '@app/ui/icons';

import {
  type RecipientIdentifierType,
  recipientIdentifierTypesMap,
} from '../recipient-fields/hooks/use-recipient-select-fields';

function makeIteratbleListOfRecipientIdentifierTypes(
  recipientTypeMap: typeof recipientIdentifierTypesMap
) {
  return (Object.entries(recipientTypeMap) as Entries<typeof recipientTypeMap>).map(
    ([key, value]) => ({ key, label: value })
  );
}
const recipientIdentifierTypes = makeIteratbleListOfRecipientIdentifierTypes(
  recipientIdentifierTypesMap
);

interface RecipientIdentifierTypeDropdownProps {
  activeRecipientIdentifierType: string;
  onSelectRecipientIdentifierType(recipientType: RecipientIdentifierType): void;
}
export function RecipientIdentifierTypeDropdown(props: RecipientIdentifierTypeDropdownProps) {
  const { activeRecipientIdentifierType, onSelectRecipientIdentifierType } = props;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.UnstyledTrigger>
        <Flag
          reverse
          img={<ChevronDownIcon variant="small" />}
          spacing="space.01"
          color="accent.text-primary"
          _hover={{ color: 'accent.action-primary-hover' }}
        >
          {activeRecipientIdentifierType}
        </Flag>
      </DropdownMenu.UnstyledTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            {recipientIdentifierTypes.map(type => (
              <DropdownMenu.Item
                key={type.key}
                onSelect={() => onSelectRecipientIdentifierType(type.key)}
                data-testid={`recipient-select-field-${type.key}`}
              >
                {type.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
