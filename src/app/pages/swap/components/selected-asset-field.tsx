import { Field } from 'formik';
import { Box, Flex, HStack } from 'leather-styles/jsx';

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
    <Flex
      alignItems="center"
      border="1px solid"
      borderColor={showError ? 'error !important' : 'accent.border-default !important'}
      borderRadius="10px"
      css={{
        '&:focus-within': {
          border: '1px solid',
          borderColor: `${
            showError ? 'error !important' : 'accent.action-primary-default !important'
          }`,
        },
      }}
      height="76px"
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
    </Flex>
  );
}
