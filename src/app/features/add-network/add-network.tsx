import { Button, Card, Page } from '@leather-wallet/ui';
import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { Form, Formik } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

import { ErrorLabel } from '@app/components/error-label';

import { AddNetworkForm } from './add-network-form';
import { useAddNetwork } from './use-add-network';

export function AddNetwork() {
  const { error, initialFormValues, loading, onSubmit } = useAddNetwork();

  return (
    <Page>
      <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
        {() => (
          <Card>
            <Form data-testid={NetworkSelectors.NetworkPageReady}>
              <Stack
                gap="space.05"
                maxWidth="pageWidth"
                px={['space.05', 'space.04']}
                textAlign={['left', 'center']}
                my="space.05"
              >
                <styled.span textStyle="body.02">
                  Use this form to add a new instance of the{' '}
                  <a
                    href="https://github.com/blockstack/stacks-blockchain-api"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Stacks Blockchain API
                  </a>{' '}
                  or{' '}
                  <a href="https://github.com/Blockstream/esplora" target="_blank" rel="noreferrer">
                    Bitcoin Blockchain API
                  </a>
                  . Make sure you review and trust the host before you add it.
                </styled.span>
                <AddNetworkForm />
                {error ? (
                  <ErrorLabel data-testid={NetworkSelectors.ErrorText}>{error}</ErrorLabel>
                ) : null}
                <Button
                  aria-busy={loading}
                  data-testid={NetworkSelectors.AddNetworkBtn}
                  type="submit"
                >
                  Add network
                </Button>
              </Stack>
            </Form>
          </Card>
        )}
      </Formik>
    </Page>
  );
}
