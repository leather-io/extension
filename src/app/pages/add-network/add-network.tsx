import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Text, Stack } from '@stacks/ui';
import { Formik } from 'formik';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { isValidUrl } from '@app/common/validation/validate-url';
import { ChainID, fetchPrivate } from '@stacks/transactions';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
import { RouteUrls } from '@shared/route-urls';
import {
  useUpdateCurrentNetworkKey,
  useUpdateNetworkState,
} from '@app/store/network/networks.hooks';
import { isFullPage } from '@app/common/utils';
import { Body } from '@app/components/typography';
import { fullPageContent } from '@app/pages/pages.styles';

export const AddNetwork = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setNetworks = useUpdateNetworkState();
  const setNetworkKey = useUpdateCurrentNetworkKey();

  useRouteHeader(<Header title="Add a network" onClose={() => navigate(RouteUrls.Home)} />);

  return (
    <Formik
      initialValues={{ name: '', url: '', key: '' }}
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
          <Stack className={isFullPage ? fullPageContent : undefined} spacing="loose">
            <Body textAlign={isFullPage ? 'center' : 'left'}>
              Use this form to add a new instance of the{' '}
              <a href="https://github.com/blockstack/stacks-blockchain-api" target="_blank">
                Stacks Blockchain API
              </a>
              . Make sure you review and trust the host before you add it.
            </Body>
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
            <Button
              borderRadius="10px"
              height="48px"
              isDisabled={loading}
              isLoading={loading}
              width="100%"
            >
              Add network
            </Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
};
