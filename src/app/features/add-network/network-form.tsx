import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { Form, Formik } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

import { Button, Link } from '@leather.io/ui';

import { ErrorLabel } from '@app/components/error-label';
import { Card } from '@app/components/layout';

import { NetworkFormFields } from './network-form-fields';
import { useAddNetwork } from './use-add-network';

interface NetworkFormProps {
  title: string;
  isEditNetworkMode?: boolean;
}

export function NetworkForm({ isEditNetworkMode, title }: NetworkFormProps) {
  const { error, initialFormValues, loading, onSubmit } = useAddNetwork();

  return (
    <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <Card
          footerBorder
          footer={
            <Button
              fullWidth
              aria-busy={loading}
              data-testid={NetworkSelectors.AddNetworkBtn}
              type="submit"
              onClick={() => handleSubmit()}
            >
              {title}
            </Button>
          }
        >
          <Form data-testid={NetworkSelectors.NetworkPageReady}>
            <Stack
              gap="space.05"
              maxWidth="pageWidth"
              px={{ base: 'space.00', sm: 'space.04', md: 'space.05' }}
              my="space.05"
            >
              <styled.span textStyle="body.02">
                Use this form to add a new instance of the{' '}
                <Link
                  href="https://github.com/blockstack/stacks-blockchain-api"
                  target="_blank"
                  rel="noreferrer"
                >
                  Stacks Blockchain API
                </Link>{' '}
                or{' '}
                <Link href="https://mempool.space/docs/api/rest" target="_blank" rel="noreferrer">
                  Bitcoin Blockchain API
                </Link>
                . Make sure you review and trust the host before you add it.
              </styled.span>
              <NetworkFormFields isEditNetworkMode={isEditNetworkMode} />
              {error ? (
                <ErrorLabel data-testid={NetworkSelectors.ErrorText}>{error}</ErrorLabel>
              ) : null}
            </Stack>
          </Form>
        </Card>
      )}
    </Formik>
  );
}
