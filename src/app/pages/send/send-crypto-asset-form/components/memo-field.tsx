import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { TextInputField } from './text-input-field';

export function MemoField() {
  return (
    <TextInputField dataTestId={SendCryptoAssetSelectors.MemoFieldInput} label="Memo" name="memo" />
  );
}
