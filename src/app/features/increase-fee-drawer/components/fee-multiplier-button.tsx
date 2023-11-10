import { ButtonProps, LeatherButton } from '@app/ui/components/button';

interface FeeMultiplierButtonProps extends ButtonProps {
  multiplier: number;
}
export function FeeMultiplierButton(props: FeeMultiplierButtonProps) {
  const { multiplier, ...rest } = props;

  return (
    <LeatherButton borderRadius="6px" key={`multiply-${multiplier}`} variant="outline" {...rest}>
      {multiplier}x
    </LeatherButton>
  );
}
