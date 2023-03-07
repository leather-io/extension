import { RecipientFieldType } from '@app/pages/send/send-crypto-asset-form/components/recipient-select/recipient-select';

import { RecipientFieldAddress } from './components/recipient-field-address';
import { RecipientFieldBnsName } from './components/recipient-field-bns-name';
import { RecipientSelectOverlay } from './components/recipient-select-overlay';
import { useStacksRecipientField } from './hooks/use-stacks-recipient-field';

export function StacksRecipientField() {
  const {
    isSelectVisible,
    onClickLabelAction,
    onSelectRecipientFieldType,
    onSetIsSelectVisible,
    selectedRecipientField,
  } = useStacksRecipientField();

  const topInputOverlay = (
    <RecipientSelectOverlay
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
