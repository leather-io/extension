// #4164 FIXME migrate - need to check thos properly, could be an icon
// probably don't need this component
import { LeatherButton } from '@app/components/button/button';

interface FeeMultiplierButtonProps {
  multiplier: number;
  onClick: () => void;
}

export function FeeMultiplierButton({
  multiplier,
  onClick,
}: FeeMultiplierButtonProps): React.JSX.Element {
  return (
    <LeatherButton
      type="button"
      // size="sm"
      // #4164 FIXME migrate  tertiary
      variant="ghost"
      borderRadius="6px"
      key={`multiply-${multiplier}`}
      onClick={onClick}
    >
      {multiplier}x
    </LeatherButton>
  );
}
