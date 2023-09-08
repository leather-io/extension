import { Field, useField } from 'formik';
import { Flex } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { Flag } from '@app/components/layout/flag';

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
      border={`1px solid ${token('colors.accent.border-default')}`}
      borderRadius="10px"
      minHeight="64px"
      mb="space.04"
      mt="space.06"
      px="space.04"
      width="100%"
    >
      <Field as="div" name="symbol">
        <Flag align="middle" img={icon} spacing="space.03">
          <styled.span textStyle="label.01">{name}</styled.span>
        </Flag>
      </Field>
    </Flex>
  );
}
