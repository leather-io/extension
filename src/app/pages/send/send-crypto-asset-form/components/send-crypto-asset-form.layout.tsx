import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Flex } from 'leather-styles/jsx';

import { CardContent } from '@app/ui/layout/card/card-content';

interface SendCryptoAssetFormLayoutProps {
  children: React.ReactNode;
}
export function SendCryptoAssetFormLayout({ children }: SendCryptoAssetFormLayoutProps) {
  return (
    <CardContent>
      <Flex
        alignItems="center"
        data-testid={SendCryptoAssetSelectors.SendForm}
        flexDirection="column"
        p="space.05"
        pt="space.06"
      >
        {children}
      </Flex>
    </CardContent>
  );
}
