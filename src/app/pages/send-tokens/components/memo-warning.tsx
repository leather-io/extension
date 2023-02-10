import { FC } from 'react';

import { InfoLabel } from '@app/components/info-label';
import { WarningLabel } from '@app/components/warning-label';

interface MemoWarningProps {
  symbol: string;
  isMemoRequired?: boolean;
}
export const SendFormMemoWarning: FC<MemoWarningProps> = ({ symbol, isMemoRequired }) => {
  const infoTitle = 'Sending to an exchange?';
  const infoText = `Be sure to include the memo they provided so the ${symbol} is credited to your account`;

  const warningTitle = `It appears you're sending to an exchange`;
  const warningText = `You need to include a memo when sending to this address so your deposit gets processed successfully`;

  return isMemoRequired ? (
    <WarningLabel title={warningTitle}>{warningText}</WarningLabel>
  ) : (
    <InfoLabel title={infoTitle}>{infoText}</InfoLabel>
  );
};
