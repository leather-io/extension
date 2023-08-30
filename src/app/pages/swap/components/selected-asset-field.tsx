import { Box, Flex } from '@stacks/ui';
import { Field } from 'formik';

import { FlagWithSpaceBetweenContent } from '@app/components/layout/flag';

interface SelectedAssetFieldProps {
  contentLeft: React.JSX.Element;
  contentRight: React.JSX.Element;
  icon?: string;
  name: string;
}
export function SelectedAssetField({
  contentLeft,
  contentRight,
  icon,
  name,
}: SelectedAssetFieldProps) {
  return (
    <Flex
      alignItems="center"
      border="1px solid #DCDDE2"
      borderRadius="10px"
      height="76px"
      mb="tight"
      minHeight="64px"
      px="base"
      width="100%"
    >
      <Box width="100%">
        <Field as="div" name={name}>
          <FlagWithSpaceBetweenContent
            align="middle"
            contentLeft={contentLeft}
            contentRight={contentRight}
            img={icon ? <Box as="img" src={icon} width="24px" /> : <></>}
            spacing="tight"
          />
        </Field>
      </Box>
    </Flex>
  );
}
