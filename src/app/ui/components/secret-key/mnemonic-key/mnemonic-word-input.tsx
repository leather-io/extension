import { useState } from 'react';

import { useField } from 'formik';

import { Input } from '@leather.io/ui';
import { extractPhraseFromString } from '@leather.io/utils';

import { useIsFieldDirty } from '@app/common/form-utils';

interface MnemonicWordInputProps {
  fieldNumber: number;
  value: string;
  onUpdateWord(word: string): void;
  onPasteEntireKey(word: string): void;
}
export function MnemonicWordInput({
  fieldNumber,
  value,
  onUpdateWord,
  onPasteEntireKey,
}: MnemonicWordInputProps) {
  const name = `${fieldNumber}`;
  const [field, meta] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const isDirty = useIsFieldDirty(name);
  return (
    <Input.Root hasError={isDirty && !!meta.error} shrink={!!value}>
      <Input.Field
        // Limitation of the animated label is that we cannot detect
        // programatically updated inputs. Here we add an empty place holder to
        // trigger the repositioning of the label
        autoCapitalize="off"
        autoComplete="off"
        spellCheck={false}
        data-testid={`mnemonic-input-${fieldNumber}`}
        id={name}
        type={isFocused ? 'text' : 'password'}
        onFocus={() => setIsFocused(!isFocused)}
        {...field}
        value={value || field.value || ''}
        // using onChangeCapture + onBlurCapture to keep Formik validation
        onChangeCapture={(e: any) => {
          e.preventDefault();
          onUpdateWord(e.target.value);
        }}
        onBlurCapture={() => setIsFocused(!isFocused)}
        onPaste={e => {
          const pasteValue = extractPhraseFromString(e.clipboardData.getData('text'));
          if (pasteValue.includes(' ')) {
            e.preventDefault();
            //assume its a full key
            onPasteEntireKey(pasteValue);
          }
        }}
      />
      <Input.Label>Word {fieldNumber}</Input.Label>
    </Input.Root>
  );
}
