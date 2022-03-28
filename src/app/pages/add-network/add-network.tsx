import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Stack } from '@stacks/ui';
import { ChainID, fetchPrivate } from '@stacks/transactions';
import { Formik } from 'formik';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { isValidUrl } from '@app/common/validation/validate-url';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ErrorLabel } from '@app/components/error-label';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Header } from '@app/components/header';
import { PrimaryButton } from '@app/components/primary-button';
import { Text } from '@app/components/typography';
import { RouteUrls } from '@shared/route-urls';
import {
  useUpdateCurrentNetworkKey,
  useUpdateNetworkState,
} from '@app/store/network/networks.hooks';

interface AddNetworkFormValues {
  key: string;
  name: string;
  url: string;
}
const addNetworkFormValues: AddNetworkFormValues = { key: '', name: '', url: '' };

export const AddNetwork = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setNetworks = useUpdateNetworkState();
  const setNetworkKey = useUpdateCurrentNetworkKey();

  useRouteHeader(<Header title="Add a network" onClose={() => navigate(RouteUrls.Home)} />);

  return (
    <CenteredPageContainer>
      <Formik
        initialValues={addNetworkFormValues}
        onSubmit={async values => {
          const { name, url, key } = values;
          if (!isValidUrl(url)) {
            setError('Please enter a valid URL');
            return;
          }
          setLoading(true);
          setError('');
          try {
            const origin = new URL(url).origin;
            const response = await fetchPrivate(`${origin}/v2/info`);
            const chainInfo = await response.json();
            const networkId = chainInfo?.network_id && parseInt(chainInfo?.network_id);
            if (networkId === ChainID.Mainnet || networkId === ChainID.Testnet) {
              setNetworks(networks => {
                return {
                  ...networks,
                  [key]: {
                    url: origin,
                    name,
                    chainId: networkId,
                  },
                };
              });
              setNetworkKey(key);
              navigate(RouteUrls.Home);
              return;
            }
            setError('Unable to determine chainID from node.');
          } catch (error) {
            setError('Unable to fetch info from node.');
          }
          setLoading(false);
        }}
      >
        {({ handleSubmit, values, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <Stack
              maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
              px={['loose', 'base-loose']}
              spacing="loose"
              textAlign={['left', 'center']}
            >
              <Text>
                Use this form to add a new instance of the{' '}
                <a href="https://github.com/blockstack/stacks-blockchain-api" target="_blank">
                  Stacks Blockchain API
                </a>
                . Make sure you review and trust the host before you add it.
              </Text>
              <Input
                autoFocus
                borderRadius="10px"
                height="64px"
                onChange={handleChange}
                name="name"
                placeholder="Name"
                value={values.name}
                width="100%"
              />
              <Input
                borderRadius="10px"
                height="64px"
                onChange={handleChange}
                name="url"
                placeholder="Address"
                value={values.url}
                width="100%"
              />
              <Input
                borderRadius="10px"
                height="64px"
                onChange={handleChange}
                name="key"
                placeholder="Key"
                value={values.key}
                width="100%"
              />
              {error ? (
                <ErrorLabel>
                  <Text textStyle="caption">{error}</Text>
                </ErrorLabel>
              ) : null}
              <PrimaryButton isDisabled={loading} isLoading={loading}>
                Add network
              </PrimaryButton>
            </Stack>
          </form>
        )}
      </Formik>
    </CenteredPageContainer>
  );
};
