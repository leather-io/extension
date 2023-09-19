import { wordlist } from '@scure/bip39/wordlists/english';

import { extractPhraseFromString } from '@app/common/utils';

import { InputField } from './mnemonic-input-field';

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
  return (
    <InputField
      name={`${fieldNumber}`}
      autoCapitalize="off"
      spellCheck={false}
      dataTestId={`mnemonic-input-${fieldNumber}`}
      onUpdateWord={onUpdateWord}
      onPaste={e => {
        const pasteValue = extractPhraseFromString(e.clipboardData.getData('text'));
        if (pasteValue.includes(' ')) {
          e.preventDefault();
          //assume its a full key
          onPasteEntireKey(pasteValue);
        }
      }}
      onChange={(e: any) => {
        e.preventDefault();
        onUpdateWord(e.target.value);
      }}
      wordlist={wordlist}
      value={value}
      height="3rem"
    />
  );
}
