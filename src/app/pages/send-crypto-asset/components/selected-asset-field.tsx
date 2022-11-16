import { ChevronIcon, Flex, Text } from '@stacks/ui';
import { Field, useField } from 'formik';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { SpaceBetween } from '@app/components/space-between';

interface SelectedAssetFieldProps {
  icon: JSX.Element;
  name: string;
  onClickAssetGoBack(): void;
  symbol: string;
}
export function SelectedAssetField({
  icon,
  name,
  onClickAssetGoBack,
  symbol,
}: SelectedAssetFieldProps) {
  const [, , helpers] = useField('symbol');

  useOnMount(() => {
    helpers.setValue(symbol);
  });

  return (
    <Field as="div" name="symbol">
      <SpaceBetween cursor="pointer" onClick={onClickAssetGoBack} px="base">
        <Flex alignItems="center">
          {icon}
          <Text ml="tight" mr="extra-tight">
            {name}
          </Text>
          <Text>({symbol})</Text>
        </Flex>
        {/* TODO: Do we need this if doing the same thing as header back arrow? */}
        <ChevronIcon size="24px" direction="right" opacity={0.7} />
      </SpaceBetween>
    </Field>
  );
}
