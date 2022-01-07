import { Body } from '@app/components/typography';
import { Card } from '@app/components/card';

interface ViewSecretKeyCardProps {
  secretKey?: string;
}
export function ViewSecretKeyCard(props: ViewSecretKeyCardProps): JSX.Element {
  const { secretKey } = props;

  return (
    <Card boxShadow="none" title="Your Secret Key">
      <Body data-testid="textarea-seed-phrase" data-loaded={String(!!secretKey)}>
        {secretKey}
      </Body>
    </Card>
  );
}
