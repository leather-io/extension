import { Box } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

interface SendCryptoAssetFormLayoutProps {
  children: JSX.Element;
}
export function SendCryptoAssetFormLayout({ children }: SendCryptoAssetFormLayoutProps) {
  return (
    <Box
      data-testid={SendCryptoAssetSelectors.SendForm}
      mt={['unset', '48px']}
      width="100%"
      pb="base"
      px="loose"
    >
      {children}
    </Box>
  );
}
