import { Ref, useRef } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';
import { Box, Flex, FlexProps, HStack, styled } from 'leather-styles/jsx';

import { useShowFieldError } from '@app/common/form-utils';
import { capitalize } from '@app/common/utils';
import { Link } from '@app/ui/components/link/link';

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
    <styled.label htmlFor={name} width="100%">
      <Flex
        _before={{
          content: '""',
          position: 'absolute',
          border: showError ? 'error' : 'unset',
          borderRadius: 'sm',
          left: '-1px',
          right: '-1px',
          top: '-1px',
          bottom: '-1px',
          pointerEvents: 'none',
        }}
        border="default"
        borderRadius="sm"
        cursor="text"
        flexDirection="column"
        justifyContent="center"
        mb={showError ? 'space.02' : 'space.04'}
        minHeight="64px"
        px="space.04"
        py="space.03"
        position="relative"
        width="100%"
        {...props}
      >
        <HStack alignItems="center" justifyContent="space-between" maxHeight="20px" mb="space.01">
          <Flex alignItems="center">
            {label && field.value ? (
              <styled.span color={showError ? 'error.label' : 'accent.text-primary'} mr="space.02">
                {label}
              </styled.span>
            ) : null}
            {topInputOverlay ? <Box zIndex={999}>{topInputOverlay}</Box> : null}
          </Flex>
          {labelAction ? (
            <Link
              data-testid={SendCryptoAssetSelectors.RecipientChooseAccountButton}
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
              variant="text"
              zIndex={999}
            >
              {labelAction}
            </Link>
          ) : null}
        </HStack>
        <styled.input
          _disabled={{ bg: 'accent.background-primary' }}
          _focus={{ border: 'none' }}
          autoComplete="off"
          bg="transparent"
          border="none"
          data-testid={dataTestId}
          disabled={isDisabled}
          display="block"
          height="24px"
          id={name}
          p="none"
          placeholder={placeholder || capitalize(name)}
          ref={inputRef || ref}
          ring="none"
          spellCheck="false"
          textStyle="body.02"
          width="100%"
          zIndex={1}
          {...field}
          onBlur={e => {
            onBlur?.();
            field.onBlur(e);
          }}
        />
      </Flex>
      <TextInputFieldError name={name} />
    </styled.label>
  );
}
