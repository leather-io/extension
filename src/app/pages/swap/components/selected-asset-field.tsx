import { Field } from 'formik';
import { Box, HStack, styled } from 'leather-styles/jsx';

interface SelectedAssetFieldProps {
  contentLeft: React.JSX.Element;
  contentRight: React.JSX.Element;
  name: string;
  showError?: boolean;
}
export function SelectedAssetField({
  contentLeft,
  contentRight,
  name,
  showError,
}: SelectedAssetFieldProps) {
  return (
    <styled.label
      _focusWithin={{ border: 'action-primary-default' }}
      alignItems="center"
      border={showError ? 'error' : 'default'}
      borderRadius="10px"
      display="flex"
      height="76px"
      htmlFor={name}
      mb="space.02"
      minHeight="64px"
      px="space.04"
      width="100%"
    >
      <Box width="100%">
        <Field as="div" name={name}>
          <HStack alignItems="center" justifyContent="space-between">
            {contentLeft}
            {contentRight}
          </HStack>
        </Field>
      </Box>
    </styled.label>
  );
}
