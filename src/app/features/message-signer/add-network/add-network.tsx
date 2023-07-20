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

/**
 * The **peer** network ID.
 * Not used in signing, but needed to determine the parent of a subnet.
 */
enum PeerNetworkID {
  Mainnet = 0x17000000,
  Testnet = 0xff000000,
}

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
          if (!key) {
            setError('Enter a unique key');
            return;
          }

          setLoading(true);
          setError('');

          try {
            const path = removeTrailingSlash(new URL(url).href);
            const response = await network.fetchFn(`${path}/v2/info`);
            const chainInfo = await response.json();
            if (!chainInfo) throw new Error('Unable to fetch info from node');

            // Attention:
            // For mainnet/testnet the v2/info response `.network_id` refers to the chain ID
            // For subnets the v2/info response `.network_id` refers to the network ID and the chain ID (they are the same for subnets)
            // The `.parent_network_id` refers to the actual peer network ID in both cases
            const { network_id: chainId, parent_network_id: parentNetworkId } = chainInfo;

            const isSubnet = typeof chainInfo.l1_subnet_governing_contract === 'string';
            const isFirstLevelSubnet =
              isSubnet &&
              (parentNetworkId === PeerNetworkID.Mainnet ||
                parentNetworkId === PeerNetworkID.Testnet);

            // Currently, only subnets of mainnet and testnet are supported in the wallet
            if (isFirstLevelSubnet) {
              const parentChainId =
                parentNetworkId === PeerNetworkID.Mainnet ? ChainID.Mainnet : ChainID.Testnet;
              networksActions.addNetwork({
                chainId: parentChainId, // Used for differentiating control flow in the wallet
                subnetChainId: chainId, // Used for signing transactions (via the network object, not to be confused with the NetworkConfigurations)
                id: key as DefaultNetworkConfigurations,
                name,
                url: path,
              });
              navigate(RouteUrls.Home);
              return;
            }

            if (chainId === ChainID.Mainnet || chainId === ChainID.Testnet) {
              networksActions.addNetwork({
                chainId,
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
                <a
                  href="https://github.com/blockstack/stacks-blockchain-api"
                  target="_blank"
                  rel="noreferrer"
                >
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
