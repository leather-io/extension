import { Flex, Text } from '@stacks/ui';
import { Field, useField } from 'formik';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { SpaceBetween } from '@app/components/layout/space-between';

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
      border="1px solid #DCDDE2"
      borderRadius="10px"
      minHeight="64px"
      mb="base"
      mt="loose"
      px="base"
      width="100%"
    >
      <Field as="div" name="symbol">
        <SpaceBetween>
          <Flex alignItems="center">
            {icon}
            <Text ml="tight" mr="extra-tight">
              {name}
            </Text>
            <Text>({symbol.toUpperCase()})</Text>
          </Flex>
        </SpaceBetween>
      </Field>
    </Flex>
  );
}
