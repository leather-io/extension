import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { TextInputField } from '@app/components/text-input-field';

export function MemoField() {
  return (
    <TextInputField dataTestId={SendCryptoAssetSelectors.MemoFieldInput} label="Memo" name="memo" />
  );
}
