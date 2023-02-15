import { Flex } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

interface SendCryptoAssetFormLayoutProps {
  children: JSX.Element;
}
export function SendCryptoAssetFormLayout({ children }: SendCryptoAssetFormLayoutProps) {
  return (
    <Flex
      alignItems="center"
      data-testid={SendCryptoAssetSelectors.SendFormContainer}
      flexDirection="column"
      justifyContent="center"
      mt={['unset', '48px']}
      maxWidth={['100%', CENTERED_FULL_PAGE_MAX_WIDTH]}
      minWidth={['100%', CENTERED_FULL_PAGE_MAX_WIDTH]}
      pb="extra-loose"
      px={['loose', 'unset']}
    >
      {children}
    </Flex>
  );
}
