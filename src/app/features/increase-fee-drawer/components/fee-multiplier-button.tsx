import { Button, ButtonProps } from '@stacks/ui';

interface FeeMultiplierButtonProps extends ButtonProps {
  multiplier: number;
}

export function FeeMultiplierButton(props: FeeMultiplierButtonProps): React.JSX.Element {
  const { multiplier, ...rest } = props;

  return (
    <Button
      type="button"
      size="sm"
      mode="tertiary"
      borderRadius="6px"
      key={`multiply-${multiplier}`}
      {...rest}
    >
      {multiplier}x
    </Button>
  );
}
