import { render, waitFor } from '@testing-library/react';

import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import { setupHeystackEnv } from '@tests/mocks/heystack';

import { PostConditions } from './post-conditions';

const message = 'You will transfer exactly 1 HEY or the transaction will abort.';
const from = 'ST2P…ZE7Z';

describe('<PostConditions />', () => {
  setupHeystackEnv();
  it('has correct message around transfer and principal', async () => {
    const { getByText } = render(
      <ProviderWithWalletAndRequestToken>
        <PostConditions />
      </ProviderWithWalletAndRequestToken>
    );
    await waitFor(() => {
      getByText(message);
      getByText(from);
    });
  });
});
