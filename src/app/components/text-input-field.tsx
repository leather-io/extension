import { Ref, useRef } from 'react';

// #4164 FIXME migrate Input
import { Input } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';
import { css } from 'leather-styles/css';
import { Box, Flex, FlexProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
}: // #4164 FIXME migrate - check other props passed
// ...props
TextInputFieldProps) {
  const [field] = useField(name);
  const ref = useRef<HTMLInputElement>(null);

  const showError = useShowFieldError(name) || hasError;

  return (
    <>
      <styled.label
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
        border={`1px solid ${token('colors.accent.border-default')}`}
        borderRadius="10px"
        className={css({
          '& :has(:focus)::before': {
            border: '2px solid #bfc6ff',
          },
        })}
        flexDirection="column"
        htmlFor={name}
        justifyContent="center"
        mb={showError ? 'space.02' : 'space.04'}
        minHeight="64px"
        px="space.04"
        py="space.03"
        position="relative"
        width="100%"
        // {...props}
      >
        <SpaceBetween maxHeight="20px" mb="space.01">
          <Flex alignItems="center">
            {label && field.value ? (
              <styled.span
                color={showError ? token('colors.error') : token('colors.ink.11')}
                fontSize={1}
                fontWeight={500}
                mr="space.02"
              >
                {label}
              </styled.span>
            ) : null}
            {topInputOverlay ? <Box zIndex={999}>{topInputOverlay}</Box> : null}
          </Flex>
          {labelAction ? (
            <styled.button
              _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
              data-testid={SendCryptoAssetSelectors.RecipientChooseAccountButton}
              textStyle="label.01"
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
            </styled.button>
          ) : null}
        </SpaceBetween>
        <Input
          ref={inputRef || ref}
          _disabled={{ bg: token('colors.accent.background-primary') }}
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
          bg="transparent"
          {...field}
          onBlur={e => {
            onBlur?.();
            field.onBlur(e);
          }}
        />
      </styled.label>
      <TextInputFieldError name={name} />
    </>
  );
}
