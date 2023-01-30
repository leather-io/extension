import { Flex, Text } from '@stacks/ui';
import { Field, useField } from 'formik';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { SpaceBetween } from '@app/components/layout/space-between';

interface SelectedAssetFieldProps {
  icon: JSX.Element;
  name: string;
  symbol: string;
}
export function SelectedAssetField({ icon, name, symbol }: SelectedAssetFieldProps) {
  const [, , helpers] = useField('symbol');

  useOnMount(() => helpers.setValue(symbol));

  return (
    <Field as="div" name="symbol">
      <SpaceBetween as="button" type="button" cursor="pointer" py="base" px="base" width="100%">
        <Flex alignItems="center">
          {icon}
          <Text ml="tight" mr="extra-tight">
            {name}
          </Text>
          <Text>({symbol.toUpperCase()})</Text>
        </Flex>
      </SpaceBetween>
    </Field>
  );
}
