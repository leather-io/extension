import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { TextInputField } from './text-input-field';

interface MemoFieldProps {
  lastChild?: boolean;
}
export function MemoField({}: MemoFieldProps) {
  return (
    <TextInputField
      dataTestId={SendCryptoAssetSelectors.MemoFieldInput}
      label="Memo"
      lastChild
      name="memo"
      placeholder="Optional message"
    />
  );
}
