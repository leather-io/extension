import { HStack, HstackProps } from 'leather-styles/jsx';

import { FeeMultiplierButton } from './fee-multiplier-button';

const multipliers = [2, 5, 10];

interface FeeMultiplierProps extends HstackProps {
  onSelectMultiplier(multiplier: number): void;
  showReset?: boolean;
}

export function FeeMultiplier(props: FeeMultiplierProps) {
  const { onSelectMultiplier, showReset, ...rest } = props;

  return (
    <HStack alignItems="center" {...rest}>
      {showReset && (
        <FeeMultiplierButton
          multiplier={1}
          key={`multiply-1`}
          onClick={() => onSelectMultiplier(1)}
        />
      )}
      {multipliers.map(multiplier => (
        <FeeMultiplierButton
          multiplier={multiplier}
          onClick={() => onSelectMultiplier(multiplier)}
          key={`multiply-${multiplier}`}
        />
      ))}
    </HStack>
  );
}
