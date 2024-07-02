import { Field, useField } from 'formik';
import { Flex, styled } from 'leather-styles/jsx';

import { Flag } from '@leather.io/ui';

import { useOnMount } from '@app/common/hooks/use-on-mount';

interface SelectedAssetFieldProps {
  icon: React.JSX.Element;
  name: string;
  symbol: string;
}
export function SelectedAssetField({ icon, name, symbol }: SelectedAssetFieldProps) {
  const [, , helpers] = useField('symbol');

  useOnMount(() => helpers.setValue(symbol));

  return (
    <Flex
      alignItems="center"
      border="default"
      borderRadius="sm"
      minHeight="64px"
      mb="space.04"
      mt="space.06"
      px="space.04"
      width="100%"
    >
      <Field as="div" name="symbol">
        <Flag img={icon} spacing="space.03">
          <styled.span textStyle="label.01">{name}</styled.span>
        </Flag>
      </Field>
    </Flex>
  );
}
