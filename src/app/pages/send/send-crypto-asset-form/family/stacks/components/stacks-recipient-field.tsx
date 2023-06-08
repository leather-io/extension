import { RecipientFieldType } from '@app/pages/send/send-crypto-asset-form/components/recipient-type-dropdown/recipient-type-dropdown';
import { fetchNameOwner } from '@app/query/stacks/bns/bns.utils';

import { useRecipientSelectFields } from '../../../components/recipient-fields/hooks/use-recipient-select-fields';
import { RecipientFieldAddress } from '../../../components/recipient-fields/recipient-field-address';
import { RecipientFieldBnsName } from '../../../components/recipient-fields/recipient-field-bns-name';
import { RecipientDropdownOverlay } from '../../../components/recipient-type-dropdown/components/recipient-dropdown-overlay';

export function StacksRecipientField() {
  const {
    isSelectVisible,
    onClickLabelAction,
    onSelectRecipientFieldType,
    onSetIsSelectVisible,
    selectedRecipientField,
  } = useRecipientSelectFields();

  const topInputOverlay = (
    <RecipientDropdownOverlay
      isSelectVisible={isSelectVisible}
      onSelectRecipientFieldType={onSelectRecipientFieldType}
      onSetIsSelectVisible={onSetIsSelectVisible}
      selectedRecipientField={selectedRecipientField}
    />
  );

  const recipientFieldAddress = (
    <RecipientFieldAddress
      isSelectVisible={isSelectVisible}
      onClickLabelAction={onClickLabelAction}
      selectedRecipientField={selectedRecipientField}
      topInputOverlay={topInputOverlay}
    />
  );

  switch (selectedRecipientField) {
    case RecipientFieldType.Address:
      return recipientFieldAddress;
    case RecipientFieldType.BnsName:
      return (
        <RecipientFieldBnsName
          fetchFn={fetchNameOwner}
          isSelectVisible={isSelectVisible}
          onClickLabelAction={onClickLabelAction}
          selectedRecipientField={selectedRecipientField}
          topInputOverlay={topInputOverlay}
        />
      );
    default:
      return recipientFieldAddress;
  }
}
