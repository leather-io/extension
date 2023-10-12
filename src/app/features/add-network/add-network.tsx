import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SelectContent, SelectItem, SelectRoot, SelectTrigger } from '@radix-ui/themes';
import { ChainID } from '@stacks/transactions';
import { Input, Stack } from '@stacks/ui';
import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { Formik, useFormik } from 'formik';
import { css } from 'leather-styles/css';
import { token } from 'leather-styles/tokens';

import { BitcoinNetworkModes, DefaultNetworkConfigurations } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';
import { isValidUrl } from '@shared/utils/validate-url';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { removeTrailingSlash } from '@app/common/url-join';
import { LeatherButton } from '@app/components/button/button';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
import { Text, Title } from '@app/components/typography';
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
  stacksUrl: string;
  bitcoinUrl: string;
}
const addNetworkFormValues: AddNetworkFormValues = {
  key: '',
  name: '',
  stacksUrl: '',
  bitcoinUrl: '',
};

export function AddNetwork() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const network = useCurrentStacksNetworkState();
  const networksActions = useNetworksActions();
  const [bitcoinApi, setBitcoinApi] = useState<BitcoinNetworkModes>('mainnet');

  const formikProps = useFormik({
    initialValues: addNetworkFormValues,
    onSubmit: () => {},
  });

  useRouteHeader(<Header title="Add a network" onClose={() => navigate(RouteUrls.Home)} />);

  const handleApiChange = (newValue: BitcoinNetworkModes) => {
    setBitcoinApi(newValue);
  };

  useEffect(() => {
    switch (bitcoinApi) {
      case 'mainnet':
        formikProps.setFieldValue('stacksUrl', 'https://api.hiro.so');
        formikProps.setFieldValue('bitcoinUrl', 'https://blockstream.info/api');
        break;
      case 'testnet':
        formikProps.setFieldValue('stacksUrl', 'https://api.testnet.hiro.so');
        formikProps.setFieldValue('bitcoinUrl', 'https://blockstream.info/testnet/api');
        break;
      case 'signet':
        formikProps.setFieldValue('stacksUrl', 'https://api.testnet.hiro.so');
        formikProps.setFieldValue('bitcoinUrl', 'https://mempool.space/signet/api');
        break;
      case 'regtest':
        formikProps.setFieldValue('stacksUrl', 'https://api.testnet.hiro.so');
        formikProps.setFieldValue('bitcoinUrl', 'https://mempool.space/testnet/api');
        break;
    }
  }, [bitcoinApi]);

  const setCustomNetwork = async (values: AddNetworkFormValues) => {
    const { name, key, stacksUrl, bitcoinUrl } = values;
    setError('');

    if (!isValidUrl(stacksUrl) || !isValidUrl(bitcoinUrl)) {
      setError('Enter a valid URL');
      return;
    }

    const bitcoinPath = removeTrailingSlash(new URL(bitcoinUrl).href);
    const bitcoinResponse = await network.fetchFn(`${bitcoinPath}/mempool/recent`);
    const bitcoinResponseJSON = await bitcoinResponse.json();
    if (!Array.isArray(bitcoinResponseJSON)) {
      setError('Unable to fetch info from node.');
      throw new Error('Unable to fetch info from node');
    }

    const stacksPath = removeTrailingSlash(new URL(stacksUrl).href);
    const stacksResponse = await network.fetchFn(`${stacksPath}/v2/info`);
    const stacksChainInfo = await stacksResponse.json();
    if (!stacksChainInfo) {
      setError('Unable to fetch info from node.');
      throw new Error('Unable to fetch info from node');
    }

    if (!key) {
      setError('Enter a unique key');
      return;
    }

    // Attention:
    // For mainnet/testnet the v2/info response `.network_id` refers to the chain ID
    // For subnets the v2/info response `.network_id` refers to the network ID and the chain ID (they are the same for subnets)
    // The `.parent_network_id` refers to the actual peer network ID in both cases
    const { network_id: chainId, parent_network_id: parentNetworkId } = stacksChainInfo;

    const isSubnet = typeof stacksChainInfo.l1_subnet_governing_contract === 'string';
    const isFirstLevelSubnet =
      isSubnet &&
      (parentNetworkId === PeerNetworkID.Mainnet || parentNetworkId === PeerNetworkID.Testnet);

    // Currently, only subnets of mainnet and testnet are supported in the wallet
    if (isFirstLevelSubnet) {
      const parentChainId =
        parentNetworkId === PeerNetworkID.Mainnet ? ChainID.Mainnet : ChainID.Testnet;
      networksActions.addNetwork({
        id: key as DefaultNetworkConfigurations,
        name,
        chainId: parentChainId, // Used for differentiating control flow in the wallet
        subnetChainId: chainId, // Used for signing transactions (via the network object, not to be confused with the NetworkConfigurations)
        url: stacksPath,
        bitcoinNetwork: bitcoinApi,
        bitcoinUrl: bitcoinPath,
      });
      navigate(RouteUrls.Home);
      return;
    }

    if (chainId === ChainID.Mainnet || chainId === ChainID.Testnet) {
      networksActions.addNetwork({
        id: key as DefaultNetworkConfigurations,
        name,
        chainId: chainId,
        url: stacksPath,
        bitcoinNetwork: bitcoinApi,
        bitcoinUrl: bitcoinPath,
      });
      navigate(RouteUrls.Home);
      return;
    }
  };

  return (
    <CenteredPageContainer>
      <Stack
        maxWidth={token('sizes.centeredPageFullWidth')}
        px={['loose', 'base-loose']}
        spacing="loose"
        textAlign={['left', 'center']}
        padding={'loose'}
      >
        <Text>
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
        </Text>
      </Stack>
      <Formik
        initialValues={addNetworkFormValues}
        onSubmit={async () => {
          setLoading(true);
          setError('');

          setCustomNetwork(formikProps.values).catch(e => {
            setError(e.message);
          });

          setLoading(false);
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Stack
              maxWidth={token('sizes.centeredPageFullWidth')}
              px={['loose', 'base-loose']}
              spacing="base-loose"
              textAlign={['left', 'center']}
            >
              <Input
                autoFocus
                borderRadius="10px"
                height="64px"
                onChange={formikProps.handleChange}
                name="name"
                placeholder="Name"
                value={formikProps.values.name}
                width="100%"
                data-testid={NetworkSelectors.NetworkName}
              />
              <Title as={'h3'}>Bitcoin API</Title>
              <SelectRoot onValueChange={handleApiChange} defaultValue="mainnet">
                <SelectTrigger
                  className={css({
                    backgroundColor: 'accent.background-primary',
                    borderRadius: '6px',
                    border: '1px solid accent.border-primary',
                  })}
                ></SelectTrigger>
                <SelectContent
                  className={css({
                    backgroundColor: 'accent.background-primary',
                    borderRadius: '6px',
                    border: '1px solid accent.border-primary',
                    dropShadow: 'lg',
                  })}
                >
                  <SelectItem key="mainnet" value="mainnet">
                    Mainnet
                  </SelectItem>
                  <SelectItem key="testnet" value="testnet">
                    Testnet
                  </SelectItem>
                  <SelectItem key="signet" value="signet">
                    Signet
                  </SelectItem>
                  <SelectItem key="regtest" value="regtest">
                    Regtest
                  </SelectItem>
                </SelectContent>
              </SelectRoot>
              <Title as={'h3'}>Stacks Address</Title>
              <Input
                borderRadius="10px"
                height="64px"
                onChange={formikProps.handleChange}
                name="stacksUrl"
                placeholder="Stacks Address"
                value={formikProps.values.stacksUrl}
                width="100%"
                data-testid={NetworkSelectors.NetworkStacksAddress}
              />
              <Title as={'h3'}>Bitcoin Address</Title>
              <Input
                borderRadius="10px"
                height="64px"
                onChange={formikProps.handleChange}
                name="bitcoinUrl"
                placeholder="Bitcoin Address"
                value={formikProps.values.bitcoinUrl}
                width="100%"
                data-testid={NetworkSelectors.NetworkBitcoinAddress}
              />
              <Input
                borderRadius="10px"
                height="64px"
                onChange={formikProps.handleChange}
                name="key"
                placeholder="Key"
                value={formikProps.values.key}
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
              <LeatherButton
                disabled={loading}
                aria-busy={loading}
                data-testid={NetworkSelectors.BtnAddNetwork}
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
