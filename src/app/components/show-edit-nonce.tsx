import { useFormikContext } from 'formik';
import { color } from '@stacks/ui';

import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';
import { TransactionFormValues } from '@app/common/transactions/transaction-utils';
import { useCurrentAccountNonce } from '@app/store/accounts/nonce.hooks';

export function ShowEditNonceAction(): JSX.Element {
  const { errors, setFieldError, setFieldValue, values } =
    useFormikContext<TransactionFormValues>();
  const { isTestnet, name } = useCurrentNetwork();
  const { showEditNonce, setShowEditNonce } = useDrawers();
  const nonce = useCurrentAccountNonce();

  return (
    <SpaceBetween>
      <Caption
        _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
        color={color('brand')}
        onClick={() => {
          if (errors.nonce) setFieldError('nonce', '');
          if (!values.nonce) setFieldValue('nonce', nonce);
          setShowEditNonce(!showEditNonce);
        }}
      >
        Edit nonce
      </Caption>
      <Caption color="currentColor">{isTestnet ? name : 'Mainnet'}</Caption>
    </SpaceBetween>
  );
}

export function ShowEditNoncePlaceholder(): JSX.Element {
  return (
    <Caption _hover={{ cursor: 'not-allowed' }} color={color('brand')}>
      Loading...
    </Caption>
  );
}
