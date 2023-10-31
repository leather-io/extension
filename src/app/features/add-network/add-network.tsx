import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { Formik } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

import { DefaultNetworkConfigurations } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';
import { isValidUrl } from '@shared/utils/validate-url';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { removeTrailingSlash } from '@app/common/url-join';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
import {
  useCurrentStacksNetworkState,
  useNetworksActions,
} from '@app/store/networks/networks.hooks';
import { LeatherButton } from '@app/ui/components/button';
import { Input } from '@app/ui/components/input';

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
              gap="space.05"
              maxWidth="centeredPageFullWidth"
              px={['space.05', 'space.04']}
              textAlign={['left', 'center']}
            >
              <styled.span textStyle="body.02">
                Use this form to add a new instance of the{' '}
                <a
                  href="https://github.com/blockstack/stacks-blockchain-api"
                  target="_blank"
                  rel="noreferrer"
                >
                  Stacks Blockchain API
                </a>
                . Make sure you review and trust the host before you add it.
              </styled.span>
              <Input
                autoFocus
                data-testid={NetworkSelectors.NetworkName}
                name="name"
                onChange={handleChange}
                placeholder="Name"
                value={values.name}
              />
              <Input
                data-testid={NetworkSelectors.NetworkAddress}
                name="url"
                onChange={handleChange}
                placeholder="Address"
                value={values.url}
              />
              <Input
                data-testid={NetworkSelectors.NetworkKey}
                name="key"
                onChange={handleChange}
                placeholder="Key"
                value={values.key}
              />
              {error ? (
                <ErrorLabel data-testid={NetworkSelectors.ErrorText}>{error}</ErrorLabel>
              ) : null}
              <LeatherButton
                disabled={loading}
                aria-busy={loading}
                data-testid={NetworkSelectors.BtnAddNetwork}
                type="submit"
              >
                Add network
              </LeatherButton>
            </Stack>
          </form>
        )}
      </Formik>
    </CenteredPageContainer>
  );
}
