import { Flex } from '@stacks/ui';

interface SendCryptoAssetLayoutProps {
  children: JSX.Element;
}
export function SendCryptoAssetLayout({ children }: SendCryptoAssetLayoutProps) {
  return (
    <Flex alignItems="center" flexDirection="column" justifyContent="center" mt="48px" width="100%">
      {children}
    </Flex>
  );
}
