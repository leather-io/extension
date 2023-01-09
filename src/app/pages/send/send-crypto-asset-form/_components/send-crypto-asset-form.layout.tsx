import { Flex } from '@stacks/ui';

interface SendCryptoAssetFormLayoutProps {
  children: JSX.Element;
}
export function SendCryptoAssetFormLayout({ children }: SendCryptoAssetFormLayoutProps) {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      mt={['unset', '48px']}
      width="100%"
    >
      {children}
    </Flex>
  );
}
