import { TextInputFieldError } from '@app/components/field-error';
import { RecipientFieldType } from '@app/pages/send/send-crypto-asset-form/components/recipient-type-dropdown/recipient-type-dropdown';

import { SelectAccountButton } from '../recipient-accounts-drawer/select-account-button';
import { RecipientField } from '../recipient-field';
import { RecipientDropdownOverlay } from '../recipient-type-dropdown/components/recipient-dropdown-overlay';
import { useRecipientSelectFields } from './hooks/use-recipient-select-fields';
import { RecipientFieldBnsName } from './recipient-field-bns-name';

interface GenericRecipientFieldProps {
  bnsFn(client: any, name: string, isTestnet?: boolean): Promise<string | null>;
}
export function GenericRecipientField({ bnsFn }: GenericRecipientFieldProps) {
  const {
    isSelectVisible,
    showRecipientAccountsModal,
    onSelectRecipientFieldType,
    onSetIsSelectVisible,
    selectedRecipientField,
  } = useRecipientSelectFields();

  const recipientDropdown = (
    <RecipientDropdownOverlay
      isSelectVisible={isSelectVisible}
      onSelectRecipientFieldType={onSelectRecipientFieldType}
      onSetIsSelectVisible={onSetIsSelectVisible}
      selectedRecipientField={selectedRecipientField}
    />
  );

  const selectAccountButton = <SelectAccountButton onClick={showRecipientAccountsModal} />;

  switch (selectedRecipientField) {
    case RecipientFieldType.BnsName:
      return (
        <>
          <RecipientFieldBnsName
            fetchFn={bnsFn}
            isSelectVisible={isSelectVisible}
            rightLabel={selectAccountButton}
            selectedRecipientField={selectedRecipientField}
            topInputOverlay={recipientDropdown}
          />
          <TextInputFieldError name="recipientBnsName" />
        </>
      );
    case RecipientFieldType.Address:
    default:
      return (
        <>
          <RecipientField
            isDisabled={isSelectVisible}
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
