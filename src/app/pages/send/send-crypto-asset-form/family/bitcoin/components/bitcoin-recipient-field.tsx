import { RecipientFieldType } from '@app/pages/send/send-crypto-asset-form/components/recipient-select/recipient-select';
import { fetchBtcNameOwner } from '@app/query/stacks/bns/bns.utils';

import { useRecipientSelectFields } from '../../../components/recipient-select-fields/hooks/use-recipient-select-fields';
import { RecipientFieldAddress } from '../../../components/recipient-select-fields/recipient-field-address';
import { RecipientFieldBnsName } from '../../../components/recipient-select-fields/recipient-field-bns-name';
import { RecipientSelectOverlay } from '../../../components/recipient-select/components/recipient-select-overlay';

export function BitcoinRecipientField() {
  const {
    isSelectVisible,
    onClickLabelAction,
    onSelectRecipientFieldType,
    onSetIsSelectVisible,
    selectedRecipientField,
  } = useRecipientSelectFields();

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
          fetchFn={fetchBtcNameOwner}
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
