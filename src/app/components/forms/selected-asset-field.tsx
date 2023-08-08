import { Box, Flex, FlexProps } from '@stacks/ui';
import { Field } from 'formik';

import { HasChildren } from '@app/common/has-children';

export function SelectedAssetField({
  children,
  name,
  ...props
}: { name: string } & HasChildren & FlexProps) {
  return (
    <Flex
      alignItems="center"
      border="1px solid #DCDDE2"
      borderRadius="10px"
      minHeight="64px"
      px="base"
      width="100%"
      {...props}
    >
      <Box width="100%">
        <Field as="div" name={name}>
          {children}
        </Field>
      </Box>
    </Flex>
  );
}
