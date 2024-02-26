import { HTMLStyledProps, styled } from 'leather-styles/jsx';

interface FeeMultiplierButtonProps extends HTMLStyledProps<'button'> {
  multiplier: number;
}
export function FeeMultiplierButton(props: FeeMultiplierButtonProps) {
  const { multiplier, ...rest } = props;

  return (
    <styled.button
      _focus={{ border: 'focus' }}
      _hover={{ bg: 'ink.component-background-hover' }}
      border="default"
      borderRadius="xs"
      key={`multiply-${multiplier}`}
      px="space.02"
      py="space.01"
      type="button"
      {...rest}
    >
      {multiplier}x
    </styled.button>
  );
}
