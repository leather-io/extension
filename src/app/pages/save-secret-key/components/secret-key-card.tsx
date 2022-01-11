import { useWallet } from '@app/common/hooks/use-wallet';
import { Body } from '@app/components/typography';
import { Card } from '@app/components/card';

export function SecretKeyCard(): JSX.Element {
  const { secretKey } = useWallet();

  return (
    <Card title="Your Secret Key">
      <Body data-testid="textarea-seed-phrase" data-loaded={String(!!secretKey)}>
        {secretKey}
      </Body>
    </Card>
  );
}
