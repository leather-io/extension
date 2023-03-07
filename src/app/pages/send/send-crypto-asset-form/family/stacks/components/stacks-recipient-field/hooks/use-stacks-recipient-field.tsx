import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { StacksSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { RecipientFieldType } from '@app/pages/send/send-crypto-asset-form/components/recipient-select/recipient-select';

import { useStacksRecipientBnsName } from './use-stacks-recipient-bns-name';

export function useStacksRecipientField() {
  const { setFieldError, setFieldTouched, setFieldValue } =
    useFormikContext<StacksSendFormValues>();
  const [selectedRecipientField, setSelectedRecipientField] = useState(RecipientFieldType.Address);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const { setBnsAddress } = useStacksRecipientBnsName();
  const navigate = useNavigate();

  const onClickLabelAction = useCallback(() => {
    setSelectedRecipientField(RecipientFieldType.Address);
    navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts);
  }, [navigate]);

  // Formik does not provide a field reset
  const resetAllRecipientFields = useCallback(() => {
    setFieldValue('recipient', '');
    setFieldError('recipient', undefined);
    setFieldTouched('recipient', false);
    setFieldValue('recipientBnsName', '');
    setFieldError('recipientBnsName', undefined);
    setFieldTouched('recipientBnsName', false);
  }, [setFieldError, setFieldTouched, setFieldValue]);

  const onSelectRecipientFieldType = useCallback(
    (index: number) => {
      resetAllRecipientFields();
      setBnsAddress('');
      setSelectedRecipientField(index);
      setIsSelectVisible(false);
    },
    [resetAllRecipientFields, setBnsAddress]
  );

  const onSetIsSelectVisible = useCallback(
    (value: boolean) => {
      resetAllRecipientFields();
      setIsSelectVisible(value);
    },
    [resetAllRecipientFields]
  );

  return {
    isSelectVisible,
    onClickLabelAction,
    onSelectRecipientFieldType,
    onSetIsSelectVisible,
    selectedRecipientField,
  };
}
