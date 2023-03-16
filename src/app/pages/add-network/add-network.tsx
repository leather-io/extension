import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { Input, Stack } from '@stacks/ui';
import { NetworkSelectors } from '@tests-legacy/integration/network.selectors';
import { Formik } from 'formik';

import { DefaultNetworkConfigurations } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';
import { isValidUrl } from '@shared/utils/validate-url';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { removeTrailingSlash } from '@app/common/url-join';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ErrorLabel } from '@app/components/error-label';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Header } from '@app/components/header';
import { PrimaryButton } from '@app/components/primary-button';
import { Text } from '@app/components/typography';
import {
  useCurrentStacksNetworkState,
  useNetworksActions,
} from '@app/store/networks/networks.hooks';

interface AddNetworkFormValues {
  key: string;
  name: string;
  url: string;
}
const addNetworkFormValues: AddNetworkFormValues = { key: '', name: '', url: '' };

export function AddNetwork() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const network = useCurrentStacksNetworkState();
  const networksActions = useNetworksActions();

  useRouteHeader(<Header title="Add a network" onClose={() => navigate(RouteUrls.Home)} />);

  return (
    <CenteredPageContainer>
      <Formik
        initialValues={addNetworkFormValues}
        onSubmit={async values => {
          const { name, url, key } = values;
          if (!isValidUrl(url)) {
            setError('Enter a valid URL');
            return;
          }
          setLoading(true);
          setError('');
          try {
            const path = removeTrailingSlash(new URL(url).href);
            const response = await network.fetchFn(`${path}/v2/info`);
            const chainInfo = await response.json();
            const networkId = chainInfo?.network_id && parseInt(chainInfo?.network_id);
            if (networkId === ChainID.Mainnet || networkId === ChainID.Testnet) {
              networksActions.addNetwork({
                chainId: networkId,
                id: key as DefaultNetworkConfigurations,
                name,
                url: path,
              });
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
                data-testid={NetworkSelectors.NetworkName}
              />
              <Input
                borderRadius="10px"
                height="64px"
                onChange={handleChange}
                name="url"
                placeholder="Address"
                value={values.url}
                width="100%"
                data-testid={NetworkSelectors.NetworkAddress}
              />
              <Input
                borderRadius="10px"
                height="64px"
                onChange={handleChange}
                name="key"
                placeholder="Key"
                value={values.key}
                width="100%"
                data-testid={NetworkSelectors.NetworkKey}
              />
              {error ? (
                <ErrorLabel>
                  <Text textStyle="caption" data-testid={NetworkSelectors.ErrorText}>
                    {error}
                  </Text>
                </ErrorLabel>
              ) : null}
              <PrimaryButton
                isDisabled={loading}
                isLoading={loading}
                data-testid={NetworkSelectors.BtnAddNetwork}
              >
                Add network
              </PrimaryButton>
            </Stack>
          </form>
        )}
      </Formik>
    </CenteredPageContainer>
  );
}
