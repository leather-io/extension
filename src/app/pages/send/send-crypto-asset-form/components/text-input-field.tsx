import { css } from '@emotion/react';
import { Flex, Input, Text, color } from '@stacks/ui';
import { useField } from 'formik';

import { SpaceBetween } from '@app/components/layout/space-between';

interface TextInputFieldProps {
  dataTestId: string;
  name: string;
  label: string;
  labelAction?: string;
  lastChild?: boolean;
  onBlur?(): void;
  onClickLabelAction?(): void;
  placeholder: string;
  topInputOverlay?: JSX.Element;
}
export function TextInputField({
  dataTestId,
  name,
  label,
  labelAction,
  lastChild,
  onBlur,
  onClickLabelAction,
  placeholder,
  topInputOverlay,
}: TextInputFieldProps) {
  const [field, meta] = useField(name);

  const showError = meta.error && meta.touched;

  return (
    <Flex
      as="label"
      htmlFor={name}
      flexDirection="column"
      p="base"
      py="base"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        border: `2px solid ${showError ? '#F7CDCA' : 'transparent'}`,
        borderBottomLeftRadius: lastChild ? '16px' : 'unset',
        borderBottomRightRadius: lastChild ? '16px' : 'unset',
        left: '-1px',
        right: '-1px',
        top: '-1px',
        bottom: '-1px',
      }}
      css={css`
        :has(:focus)::before {
          border: 2px solid #bfc6ff;
        }
      `}
    >
      <SpaceBetween mb="tight">
        <Flex alignItems="center">
          <Text
            color={showError ? '#C83532' : color('text-caption')}
            fontSize={0}
            fontWeight={500}
            mr="tight"
          >
            {label}
          </Text>
          {topInputOverlay}
        </Flex>
        {labelAction ? (
          <Text
            _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
            as="button"
            color={color('accent')}
            fontSize={0}
            onClick={onClickLabelAction}
            type="button"
            zIndex={999}
          >
            {labelAction}
          </Text>
        ) : null}
      </SpaceBetween>
      <Input
        _focus={{ border: 'none' }}
        spellCheck="false"
        data-testid={dataTestId}
        id={name}
        autoComplete="off"
        border="none"
        display="block"
        fontSize={1}
        height="24px"
        p="none"
        placeholder={placeholder}
        type="input"
        width="100%"
        {...field}
        onBlur={e => {
          onBlur?.();
          field.onBlur(e);
        }}
      />
    </Flex>
  );
}
