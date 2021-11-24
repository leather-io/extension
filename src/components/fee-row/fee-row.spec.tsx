import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import { setupHeystackEnv } from '@tests/mocks/heystack';

import { FeeRow } from './fee-row';
import { Formik } from 'formik';

const selectorText = 'Standard';

describe('<FeeRow />', () => {
  setupHeystackEnv();
  it('defaults to middle fee estimation', async () => {
    const { getByText } = render(
      <ProviderWithWalletAndRequestToken>
        <Formik
          initialValues={{ fee: 0 }}
          onSubmit={() => {}}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
        >
          {() => <FeeRow fieldName="fee" isSponsored={false} feeEstimationsError={false} />}
        </Formik>
      </ProviderWithWalletAndRequestToken>
    );
    await waitFor(() => {
      getByText(selectorText);
    });
  });
});
