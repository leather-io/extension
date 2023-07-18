import { Ref, useRef } from 'react';

import { css } from '@emotion/react';
import { Box, Flex, FlexProps, Input, Text, color } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';

import { useShowFieldError } from '@app/common/form-utils';
import { capitalize } from '@app/common/utils';
import { SpaceBetween } from '@app/components/layout/space-between';

import { TextInputFieldError } from './field-error';

interface TextInputFieldProps extends FlexProps {
  dataTestId?: string;
  isDisabled?: boolean;
  label?: string;
  labelAction?: string;
  name: string;
  onBlur?(): void;
  onClickLabelAction?(): void;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  topInputOverlay?: React.JSX.Element;
  hasError?: boolean;
}
export function TextInputField({
  dataTestId,
  isDisabled,
  label,
  labelAction,
  name,
  onBlur,
  onClickLabelAction,
  placeholder,
  topInputOverlay,
  inputRef,
  hasError,
  ...props
}: TextInputFieldProps) {
  const [field] = useField(name);
  const ref = useRef<HTMLInputElement>(null);

  const showError = useShowFieldError(name) || hasError;

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
        css={css`
          :has(:focus)::before {
            border: 2px solid #bfc6ff;
          }
        `}
        flexDirection="column"
        htmlFor={name}
        justifyContent="center"
        mb={showError ? 'tight' : 'base'}
        minHeight="64px"
        px="base"
        py="base-tight"
        position="relative"
        width="100%"
        {...props}
      >
        <SpaceBetween maxHeight="20px" mb="extra-tight">
          <Flex alignItems="center">
            {label && field.value ? (
              <Text
                color={showError ? '#C83532' : color('accent')}
                fontSize={1}
                fontWeight={500}
                mr="tight"
              >
                {label}
              </Text>
            ) : null}
            {topInputOverlay ? <Box zIndex={999}>{topInputOverlay}</Box> : null}
          </Flex>
          {labelAction ? (
            <Text
              _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
              data-testid={SendCryptoAssetSelectors.RecipientChooseAccountButton}
              as="button"
              color={color('accent')}
              fontSize={1}
              fontWeight={500}
              // Prevents focusing underlying input
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                onClickLabelAction?.();
                // Improves UX of selecting a recipient from the window. As the
                // button to open the drawer is inside the input, we force
                // blur the input when interacting with the modal, if focused.
                if (ref.current !== null && ref.current === document.activeElement)
                  ref.current.blur();
              }}
              type="button"
              zIndex={999}
            >
              {labelAction}
            </Text>
          ) : null}
        </SpaceBetween>
        <Input
          ref={inputRef || ref}
          _disabled={{ bg: color('bg') }}
          _focus={{ border: 'none' }}
          autoComplete="off"
          border="none"
          data-testid={dataTestId}
          display="block"
          fontSize={1}
          height="24px"
          id={name}
          isDisabled={isDisabled}
          p="none"
          placeholder={placeholder || capitalize(name)}
          spellCheck="false"
          type="input"
          width="100%"
          {...field}
          onBlur={e => {
            onBlur?.();
            field.onBlur(e);
          }}
        />
      </Flex>
      <TextInputFieldError name={name} />
    </>
  );
}
