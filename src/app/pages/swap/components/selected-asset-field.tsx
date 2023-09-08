import { Field } from 'formik';
import { Box, Flex, styled } from 'leather-styles/jsx';

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
      border="1px solid"
      borderColor="accent.border-default !important"
      borderRadius="10px"
      height="76px"
      mb="space.02"
      minHeight="64px"
      px="space.04"
      width="100%"
    >
      <Box width="100%">
        <Field as="div" name={name}>
          <FlagWithSpaceBetweenContent
            align="middle"
            contentLeft={contentLeft}
            contentRight={contentRight}
            img={
              icon ? <styled.img src={icon} width="24px" height="24px" alt="Swap asset" /> : <></>
            }
            spacing="tight"
          />
        </Field>
      </Box>
    </Flex>
  );
}
