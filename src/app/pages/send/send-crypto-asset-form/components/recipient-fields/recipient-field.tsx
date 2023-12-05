import { TextInputFieldError } from '@app/components/field-error';

import { SelectAccountButton } from '../recipient-accounts-dialog/select-account-button';
import { RecipientAddressTypeField } from '../recipient-address-type-field';
import { RecipientIdentifierTypeDropdown } from '../recipient-type-dropdown/recipient-type-dropdown';
import { useRecipientSelectFields } from './hooks/use-recipient-select-fields';
import { RecipientBnsNameTypeField } from './recipient-bns-name-type-field';

interface RecipientFieldProps {
  bnsLookupFn(client: any, name: string, isTestnet?: boolean): Promise<string | null>;
}
export function RecipientField({ bnsLookupFn }: RecipientFieldProps) {
  const {
    showRecipientAccountsModal,
    onSelectRecipientFieldType,
    selectedRecipientFieldName,
    selectedRecipientField,
  } = useRecipientSelectFields();

  const recipientDropdown = (
    <RecipientIdentifierTypeDropdown
      activeRecipientIdentifierType={selectedRecipientFieldName}
      onSelectRecipientIdentifierType={recipientType => onSelectRecipientFieldType(recipientType)}
    />
  );

  const selectAccountButton = <SelectAccountButton onClick={showRecipientAccountsModal} />;

  switch (selectedRecipientField) {
    case 'bnsName':
      return (
        <>
          <RecipientBnsNameTypeField
            fetchFn={bnsLookupFn}
            rightLabel={selectAccountButton}
            topInputOverlay={recipientDropdown}
          />
          <TextInputFieldError name="recipientBnsName" />
        </>
      );
    case 'address':
    default:
      return (
        <>
          <RecipientAddressTypeField
            name="recipient"
            rightLabel={selectAccountButton}
            placeholder="Enter recipient address"
            topInputOverlay={recipientDropdown}
          />
          <TextInputFieldError name="recipient" />
        </>
      );
  }
}
