import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import type { Entries } from '@leather.io/models';

import { RouteUrls } from '@shared/route-urls';

import { useRecipientBnsName } from './use-recipient-bns-name';

const recipientIdentifierTypesMap = { address: 'Address', bnsName: 'BNS Name' } as const;

export type RecipientIdentifierType = keyof typeof recipientIdentifierTypesMap;

function makeIteratbleListOfRecipientIdentifierTypes(
  recipientTypeMap: typeof recipientIdentifierTypesMap
) {
  return (Object.entries(recipientTypeMap) as Entries<typeof recipientTypeMap>).map(
    ([key, value]) => ({ key, label: value })
  );
}
export const recipientIdentifierTypes = makeIteratbleListOfRecipientIdentifierTypes(
  recipientIdentifierTypesMap
);

export function useRecipientSelectFields() {
  const { setFieldError, setFieldTouched, setFieldValue } = useFormikContext();

  const [selectedRecipientField, setSelectedRecipientField] =
    useState<RecipientIdentifierType>('address');

  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const { setBnsAddress } = useRecipientBnsName();
  const navigate = useNavigate();

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

      selectedRecipientFieldName: recipientIdentifierTypesMap[selectedRecipientField],

      isSelectVisible,

      showRecipientAccountsModal() {
        setSelectedRecipientField('address');
        navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts, { replace: true });
      },

      async onSelectRecipientFieldType(recipientType: RecipientIdentifierType) {
        await resetAllRecipientFields();
        setBnsAddress('');
        setSelectedRecipientField(recipientType);
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
