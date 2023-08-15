import { Box, color } from '@stacks/ui';
import { useFocus } from 'use-events';

import { extractPhraseFromString } from '@app/common/utils';
import { MnemonicInputField } from '@app/components/mnemonic-input-field';

interface MnemonicWordInputProps {
  index: number;
  onUpdateWord(word: string): void;
  onPasteEntireKey(word: string): void;
}
export function MnemonicWordInput({
  index,
  onUpdateWord,
  onPasteEntireKey,
}: MnemonicWordInputProps) {
  const [isFocused, bind] = useFocus();

  return (
    <Box
      position="relative"
      _after={{
        content: `"${index + 1}."`,
        textAlign: 'right',
        position: 'absolute',
        top: 0,
        left: '-22px',
        lineHeight: '48px',
        color: color('text-caption'),
        fontSize: '12px',
        width: '18px',
      }}
    >
      <MnemonicInputField
        type={isFocused ? 'text' : 'password'}
        name={`mnemonic-input-${index}`}
        autoCapitalize="off"
        spellCheck={false}
        data-testid={`mnemonic-input-${index}`}
        placeholder="none"
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
        px="14px 16px"
        height="48px"
        {...bind}
      />
    </Box>
  );
}
