import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { BitcoinSendFormValues, StacksSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { RecipientFieldType } from '@app/pages/send/send-crypto-asset-form/components/recipient-type-dropdown/recipient-type-dropdown';

import { useRecipientBnsName } from './use-recipient-bns-name';

export function useRecipientSelectFields() {
  const { setFieldError, setFieldTouched, setFieldValue } = useFormikContext<
    BitcoinSendFormValues | StacksSendFormValues
  >();
  const [selectedRecipientField, setSelectedRecipientField] = useState(RecipientFieldType.Address);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const { setBnsAddress } = useRecipientBnsName();
  const navigate = useNavigate();

  // Formik does not provide a field reset
  const resetAllRecipientFields = useCallback(async () => {
    void setFieldValue('recipient', '');
    setFieldError('recipient', undefined);
    await setFieldTouched('recipient', false);
    void setFieldValue('recipientBnsName', '');
    setFieldError('recipientBnsName', undefined);
    await setFieldTouched('recipientBnsName', false);
  }, [setFieldValue, setFieldError, setFieldTouched]);

  return useMemo(
    () => ({
      selectedRecipientField,
      isSelectVisible,

      showRecipientAccountsModal() {
        setSelectedRecipientField(RecipientFieldType.Address);
        navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts, { replace: true });
      },

      async onSelectRecipientFieldType(index: number) {
        await resetAllRecipientFields();
        setBnsAddress('');
        setSelectedRecipientField(index);
        setIsSelectVisible(false);
      },

      async onSetIsSelectVisible(value: boolean) {
        await resetAllRecipientFields();
        setIsSelectVisible(value);
      },
    }),
    [isSelectVisible, navigate, resetAllRecipientFields, selectedRecipientField, setBnsAddress]
  );
}
