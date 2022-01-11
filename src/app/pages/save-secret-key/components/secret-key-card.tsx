import { Body } from '@app/components/typography';
import { Card } from '@app/components/card';

interface SecretKeyCardProps {
  secretKey?: string;
}
export function SecretKeyCard(props: SecretKeyCardProps): JSX.Element {
  const { secretKey } = props;

  return (
    <Card boxShadow="none" title="Your Secret Key">
      <Body data-testid="textarea-seed-phrase" data-loaded={String(!!secretKey)}>
        {secretKey}
      </Body>
    </Card>
  );
}
