import { render, waitFor } from '@testing-library/react';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';

import { TransactionError } from './transaction-error';

describe('<TransactionError />', () => {
  it('correctly displays the transaction error when no contract is found', async () => {
    const { findByText } = render(
      <ProviderWithWalletAndRequestToken>
        <TransactionError />
      </ProviderWithWalletAndRequestToken>
    );
    await waitFor(() => {
      void findByText('Contract not found');
    });
  });
});
