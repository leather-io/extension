import { Flex, Input, color } from '@stacks/ui';
import { useField } from 'formik';

import { Caption } from '@app/components/typography';

interface TextInputFieldProps {
  name: string;
  label: string;
  lastChild?: boolean;
  placeholder: string;
}
export function TextInputField({ name, label, lastChild, placeholder }: TextInputFieldProps) {
  const [field, meta] = useField(name);

  const showError = meta.error && meta.touched;

  const errorProps = showError
    ? ({
        _before: {
          content: '""',
          position: 'absolute',
          border: '2px solid #F7CDCA',
          borderBottomLeftRadius: lastChild ? '16px' : 'unset',
          borderBottomRightRadius: lastChild ? '16px' : 'unset',
          left: '-1px',
          right: '-1px',
          top: '-1px',
          bottom: '-1px',
        },
      } as const)
    : {};

  return (
    <Flex
      as="label"
      htmlFor={name}
      flexDirection="column"
      p="base"
      py="base"
      position="relative"
      {...errorProps}
    >
      <Caption
        color={showError ? '#C83532' : color('text-caption')}
        fontWeight={500}
        mb="extra-tight"
      >
        {label}
      </Caption>
      <Input
        _focus={{ border: 'none' }}
        id={name}
        autoComplete="off"
        border="none"
        display="block"
        fontSize={2}
        height="24px"
        p="none"
        type="input"
        width="100%"
        placeholder={placeholder}
        {...field}
      />
    </Flex>
  );
}
