import { Flex, Text } from '@stacks/ui';
import { Field, useField } from 'formik';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { SpaceBetween } from '@app/components/space-between';

interface SelectedAssetFieldProps {
  icon: JSX.Element;
  name: string;
  symbol: string;
  onClickAssetGoBack(): void;
}
export function SelectedAssetField({
  icon,
  name,
  onClickAssetGoBack,
  symbol,
}: SelectedAssetFieldProps) {
  const [, , helpers] = useField('symbol');

  useOnMount(() => helpers.setValue(symbol));

  return (
    <Field as="div" name="symbol">
      <SpaceBetween
        as="button"
        type="button"
        cursor="pointer"
        onClick={onClickAssetGoBack}
        py="base"
        px="base"
        width="100%"
      >
        <Flex alignItems="center">
          {icon}
          <Text ml="tight" mr="extra-tight">
            {name}
          </Text>
          <Text>({symbol})</Text>
        </Flex>
      </SpaceBetween>
    </Field>
  );
}
