import { useCallback, useState } from 'react';

import { TextField } from '@radix-ui/themes';
import { useField } from 'formik';
import { css } from 'leather-styles/css';
import { FlexProps, styled } from 'leather-styles/jsx';

import { useIsFieldDirty } from '@app/common/form-utils';

interface InputFieldProps extends FlexProps {
  dataTestId?: string;
  name: string;
  value: string;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onUpdateWord: (word: string) => void;
  hasError?: boolean;
  wordlist: string[];
}
export function InputField({ dataTestId, name, onPaste, onChange, value }: InputFieldProps) {
  const [field, meta] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const isDirty = useIsFieldDirty(name);

  const getBorderColour = useCallback(() => {
    if (isDirty && meta.error) {
      // FIXME #4130: show a red border on error - couldn't get it working
      return 'colors.error';
    }
    if (isFocused) {
      return 'accent.text-primary';
    }
    return 'none';
  }, [isDirty, isFocused, meta.error]);

  return (
    <TextField.Root
      /**
       * Focus styling:
       * radix inserts a <div inside the root with .rt-TextFieldChrome
       * onFocus - this adds an unwanted box-shadow
       * setting color="brown" makes this transparent
       * then focus border can be controlled more easily
       */
      color="brown"
      className={css({
        display: 'flex',
        alignSelf: 'stretch',
        height: '48px',
        width: '176px',
        gap: 'space.01',
        px: 'space.03',
        border: '2px solid',
        borderColor: getBorderColour(),
        borderRadius: '4px',
      })}
    >
      <TextField.Slot>
        {/* // FIXME #4130: - update this color when available in design system */}
        <styled.span textStyle="label.01" color="GrayText">{`${name}.`}</styled.span>
      </TextField.Slot>
      <TextField.Input
        autoCapitalize="off"
        autoComplete="off"
        data-testid={dataTestId}
        className={css({
          height: '24px',
          lineHeight: '24px',
          marginTop: 'space.03',
          marginBottom: 'space.03',
          fontSize: '17px',
        })}
        id={name}
        spellCheck="false"
        type={isFocused ? 'text' : 'password'}
        onFocus={() => setIsFocused(!isFocused)}
        {...field}
        value={value || field.value || ''}
        // using onChangeCapture + onBlurCapture keep Formik validation
        onChangeCapture={onChange}
        onBlurCapture={() => setIsFocused(!isFocused)}
        onPaste={onPaste}
      />
    </TextField.Root>
  );
}
