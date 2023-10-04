import { useState } from 'react';

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

const psuedoBorderStyles = {
  content: '""',
  zIndex: 1,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  background: 'transparent',
  position: 'absolute',
  border: '1px solid',
  borderRadius: '4px',
};

export function InputField({ dataTestId, name, onPaste, onChange, value }: InputFieldProps) {
  const [field, meta] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const isDirty = useIsFieldDirty(name);

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
      data-state={isDirty && meta.error ? 'error' : undefined}
      className={css({
        display: 'flex',
        alignSelf: 'stretch',
        height: '48px',
        width: '176px',
        gap: 'space.01',
        px: 'space.03',
        _focusWithin: {
          _before: {
            ...psuedoBorderStyles,
            borderColor: 'currentColor',
          },
        },
        '&[data-state=error]': {
          _before: {
            ...psuedoBorderStyles,
            borderColor: 'error',
          },
        },
      })}
    >
      <TextField.Slot className={css({ padding: 'space.00', marginRight: 'space.01' })}>
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
        // using onChangeCapture + onBlurCapture to keep Formik validation
        onChangeCapture={onChange}
        onBlurCapture={() => setIsFocused(!isFocused)}
        onPaste={onPaste}
      />
    </TextField.Root>
  );
}
