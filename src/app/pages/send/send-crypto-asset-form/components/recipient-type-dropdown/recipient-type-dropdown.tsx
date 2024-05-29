import { ChevronDownIcon, DropdownMenu, Flag } from '@leather-wallet/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import {
  type RecipientIdentifierType,
  recipientIdentifierTypes,
} from '../recipient-fields/hooks/use-recipient-select-fields';

interface RecipientIdentifierTypeDropdownProps {
  activeRecipientIdentifierType: string;
  onSelectRecipientIdentifierType(recipientType: RecipientIdentifierType): void;
}
export function RecipientIdentifierTypeDropdown(props: RecipientIdentifierTypeDropdownProps) {
  const { activeRecipientIdentifierType, onSelectRecipientIdentifierType } = props;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        data-testid={SendCryptoAssetSelectors.RecipientSelectRecipientTypeDropdown}
      >
        <Flag
          reverse
          img={<ChevronDownIcon variant="small" />}
          spacing="space.01"
          color="ink.text-primary"
          _hover={{ color: 'ink.action-primary-hover' }}
        >
          {activeRecipientIdentifierType}
        </Flag>
      </DropdownMenu.Trigger>
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
