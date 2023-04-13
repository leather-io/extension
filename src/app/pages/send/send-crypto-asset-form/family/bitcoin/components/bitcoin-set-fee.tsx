import { Stack, Text } from '@stacks/ui';

import { FeesCard } from '../../../components/fees-card';
import { useBitcoinSetFees } from './use-bitcoin-set-fees';

interface BitcoinSetFeeProps {
  onChooseFee(feeRate: number, feeValue: number, time: string): Promise<void> | void;
  recipient: string;
  amount: number;
}

export function BitcoinSetFee({ onChooseFee, recipient, amount }: BitcoinSetFeeProps) {
  const { feesList } = useBitcoinSetFees({ recipient, amount });

  return (
    <Stack p="extra-loose" width="100%" spacing="extra-loose" alignItems="center">
      <Stack width="100%" spacing="base">
        {feesList.map(({ label, value, btcValue, fiatValue, time, feeRate }) => (
          <FeesCard
            key={label}
            feeType={label}
            feeAmount={btcValue}
            feeFiatValue={fiatValue}
            arrivesIn={time}
            onClick={() => onChooseFee(feeRate, value, time)}
          />
        ))}
      </Stack>

      <Text fontSize="14px" color="#74777D" textAlign="center">
        Fees are deducted from your balance,
        <br /> it won't affect your sending amount.
      </Text>
    </Stack>
  );
}
