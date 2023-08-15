import { Flex, FlexProps, Input, color } from '@stacks/ui';
import { useField } from 'formik';
import { css } from 'leaf-styles/css';

import { useShowFieldError } from '@app/common/form-utils';

import { TextInputFieldError } from './field-error';

interface MnemonicInputFieldProps extends FlexProps {
  dataTestId?: string;
  name: string;
  onFocus?(e: React.FocusEvent<Element, Element>): void;
  type: 'text' | 'password';
  hasError?: boolean;
}
export function MnemonicInputField({
  dataTestId,
  name,
  placeholder,
  type,
  ...props
}: MnemonicInputFieldProps) {
  const [field] = useField(name);

  const showError = useShowFieldError(name);
  return (
    <>
      <Flex
        _before={{
          content: '""',
          position: 'absolute',
          border: `2px solid ${showError ? '#F7CDCA' : 'transparent'}`,
          borderRadius: '10px',
          left: '-1px',
          right: '-1px',
          top: '-1px',
          bottom: '-1px',
        }}
        as="label"
        border="1px solid #DCDDE2"
        borderRadius="10px"
        className={css({
          '& :has(:focus)::before': {
            border: '2px solid #bfc6ff',
          },
        })}
        flexDirection="column"
        htmlFor={name}
        justifyContent="center"
        px="base"
        py="base-tight"
        position="relative"
        width="100%"
        {...props}
      >
        <Input
          _disabled={{ bg: color('bg') }}
          _focus={{ border: 'none' }}
          autoComplete="off"
          border="none"
          data-testid={dataTestId}
          display="block"
          fontSize={1}
          height="24px"
          id={name}
          spellCheck="false"
          type={type}
          width="100%"
          {...field}
        />
      </Flex>
      {field.value !== '' && <TextInputFieldError name={name} />}
    </>
  );
}
