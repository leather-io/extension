import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';

import type { BitcoinNetworkModes, DefaultNetworkConfigurations } from '@leather-wallet/models';

import { RouteUrls } from '@shared/route-urls';
import { isValidUrl } from '@shared/utils/validate-url';

import { removeTrailingSlash } from '@app/common/url-join';
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

export interface AddNetworkFormValues {
  key: string;
  name: string;
  stacksUrl: string;
  bitcoinUrl: string;
  bitcoinNetwork: BitcoinNetworkModes;
}

const initialFormValues: AddNetworkFormValues = {
  key: '',
  name: '',
  stacksUrl: '',
  bitcoinUrl: '',
  bitcoinNetwork: 'mainnet',
};

export function useAddNetwork() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const network = useCurrentStacksNetworkState();
  const networksActions = useNetworksActions();

  return {
    error,
    initialFormValues,
    loading,
    onSubmit: async (values: AddNetworkFormValues) => {
      const { name, stacksUrl, bitcoinUrl, key, bitcoinNetwork } = values;

      if (!name) {
        setError('Enter a name');
        return;
      }

      if (!isValidUrl(stacksUrl)) {
        setError('Enter a valid Stacks API URL');
        return;
      }

      if (!isValidUrl(bitcoinUrl)) {
        setError('Enter a valid Bitcoin API URL');
        return;
      }

      if (!key) {
        setError('Enter a unique key');
        return;
      }

      setLoading(true);
      setError('');

      const stacksPath = removeTrailingSlash(new URL(values.stacksUrl).href);
      const bitcoinPath = removeTrailingSlash(new URL(values.bitcoinUrl).href);

      try {
        const bitcoinResponse = await network.fetchFn(`${bitcoinPath}/mempool/recent`);
        if (!bitcoinResponse.ok) throw new Error('Unable to fetch mempool from bitcoin node');
        const bitcoinMempool = await bitcoinResponse.json();
        if (!Array.isArray(bitcoinMempool))
          throw new Error('Unable to fetch mempool from bitcoin node');
      } catch (error) {
        setError('Unable to fetch mempool from bitcoin node');
        setLoading(false);
        return;
      }

      let stacksChainInfo: any;
      try {
        const stacksResponse = await network.fetchFn(`${stacksPath}/v2/info`);
        stacksChainInfo = await stacksResponse.json();
        if (!stacksChainInfo) throw new Error('Unable to fetch info from stacks node');
      } catch (error) {
        setError('Unable to fetch info from stacks node');
        setLoading(false);
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
          name: name,
          chainId: parentChainId, // Used for differentiating control flow in the wallet
          subnetChainId: chainId, // Used for signing transactions (via the network object, not to be confused with the NetworkConfigurations)
          url: stacksPath,
          bitcoinNetwork,
          bitcoinUrl: bitcoinPath,
        });
        navigate(RouteUrls.Home);
      } else if (chainId === ChainID.Mainnet || chainId === ChainID.Testnet) {
        networksActions.addNetwork({
          id: key as DefaultNetworkConfigurations,
          name: name,
          chainId: chainId,
          url: stacksPath,
          bitcoinNetwork,
          bitcoinUrl: bitcoinPath,
        });
        navigate(RouteUrls.Home);
      } else {
        setError('Unable to determine chainID from node.');
      }
      setLoading(false);
    },
  };
}
