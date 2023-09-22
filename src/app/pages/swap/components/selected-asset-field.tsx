import { Field } from 'formik';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

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
      mb="tight"
      minHeight="64px"
      px="base"
      width="100%"
    >
      <Box width="100%">
        <Field as="div" name={name}>
          <Flag
            align="middle"
            img={
              icon ? <styled.img src={icon} width="24px" height="24px" alt="Swap asset" /> : null
            }
            spacing="tight"
          >
            <SpaceBetween>
              {contentLeft}
              {contentRight}
            </SpaceBetween>
          </Flag>
        </Field>
      </Box>
    </Flex>
  );
}
