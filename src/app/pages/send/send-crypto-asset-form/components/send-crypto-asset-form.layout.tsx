import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Flex } from 'leather-styles/jsx';

interface SendCryptoAssetFormLayoutProps {
  children: React.ReactNode;
}
export function SendCryptoAssetFormLayout({ children }: SendCryptoAssetFormLayoutProps) {
  return (
    <Flex
      alignItems="center"
      data-testid={SendCryptoAssetSelectors.SendForm}
      flexDirection="column"
      maxHeight={['calc(100vh - 116px)', 'calc(85vh - 116px)']}
      overflowY="auto"
      pb={['120px', '48px']}
      pt={['space.04', '48px']}
      px="space.05"
      width="100%"
    >
      {children}
    </Flex>
  );
}
