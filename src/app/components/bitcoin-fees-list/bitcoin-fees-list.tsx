import { Stack, Text } from '@stacks/ui';

import { LoadingSpinner } from '../loading-spinner';
import { FeesCard } from './components/fees-card';
import { useBitcoinFeesList } from './use-bitcoin-fees-list';

interface BitcoinFeesListProps {
  amount: number;
  onChooseFee(feeRate: number, feeValue: number, time: string): Promise<void> | void;
  recipient: string;
}
export function BitcoinFeesList({ amount, onChooseFee, recipient }: BitcoinFeesListProps) {
  const { feesList, isLoading } = useBitcoinFeesList({ amount, recipient });

  if (isLoading) return <LoadingSpinner />;

  if (!feesList.length) {
    return (
      <Stack alignItems="center" spacing="extra-loose" width="100%">
        <Text color="#74777D" fontSize="14px" textAlign="center">
          Unable to fetch fees. Please try again later.
        </Text>
      </Stack>
    );
  }
  return (
    <Stack alignItems="center" spacing="extra-loose" width="100%">
      <Stack spacing="base" width="100%">
        {feesList.map(({ label, value, btcValue, fiatValue, time, feeRate }) => (
          <FeesCard
            arrivesIn={time}
            feeAmount={btcValue}
            feeFiatValue={fiatValue}
            feeType={label}
            key={label}
            onClick={() => onChooseFee(feeRate, value, time)}
          />
        ))}
      </Stack>
      <Text color="#74777D" fontSize="14px" textAlign="center">
        Fees are deducted from your balance,
        <br /> it won't affect your sending amount.
      </Text>
    </Stack>
  );
}
