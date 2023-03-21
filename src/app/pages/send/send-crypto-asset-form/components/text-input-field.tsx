import { css } from '@emotion/react';
import { Box, Flex, FlexProps, Input, Text, color } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';

import { capitalize } from '@app/common/utils';
import { SpaceBetween } from '@app/components/layout/space-between';

import { FieldError } from './field-error';

interface TextInputFieldProps extends FlexProps {
  dataTestId?: string;
  isDisabled?: boolean;
  label?: string;
  labelAction?: string;
  name: string;
  onBlur?(): void;
  onClickLabelAction?(): void;
  placeholder?: string;
  topInputOverlay?: JSX.Element;
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
  ...props
}: TextInputFieldProps) {
  const [field, meta] = useField(name);

  const showError = meta.error && meta.touched;

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
                color={showError ? '#C83532' : color('text-caption')}
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
              onClick={onClickLabelAction}
              type="button"
              zIndex={999}
            >
              {labelAction}
            </Text>
          ) : null}
        </SpaceBetween>
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
      <FieldError name={name} />
    </>
  );
}
