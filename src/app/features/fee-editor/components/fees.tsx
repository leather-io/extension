import { Stack } from 'leather-styles/jsx';

import { CustomFeeItem } from './custom-fee-item';
import { FeeItem } from './fee-item';

interface FeesProps {
  children: React.ReactNode;
}

function Fees({ children }: FeesProps) {
  return <Stack gap="space.03">{children}</Stack>;
}

Fees.Item = FeeItem;
Fees.CustomItem = CustomFeeItem;

export { Fees };
