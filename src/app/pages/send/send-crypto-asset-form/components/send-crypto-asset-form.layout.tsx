import { Box } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

interface SendCryptoAssetFormLayoutProps {
  children: JSX.Element;
}
export function SendCryptoAssetFormLayout({ children }: SendCryptoAssetFormLayoutProps) {
  return (
    <Box data-testid={SendCryptoAssetSelectors.SendForm} pb="base" width="100%">
      {children}
    </Box>
  );
}
