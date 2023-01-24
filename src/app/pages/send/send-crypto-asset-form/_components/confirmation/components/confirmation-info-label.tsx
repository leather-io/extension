import { InfoLabel } from '@app/components/info-label';

export function ConfirmationInfoLabel(props: { symbol: string }) {
  return (
    <InfoLabel mb="base" title="Sending to an exchange?">
      {`Make sure you include the memo so the exchange can credit the ${props.symbol?.toUpperCase()} to your account`}
    </InfoLabel>
  );
}
