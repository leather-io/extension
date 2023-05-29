import axios from 'axios';
import urlJoin from 'url-join';

import { useConfigOrdinalsbot } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

interface TextInscriptionSuccessResponse {
  status: 'ok';
  charge: {
    id: string;
    address: string;
    amount: number;
    lightning_invoice: {
      expires_at: number;
      payreq: string;
    };
    created_at: number;
  };
  chainFee: number;
  serviceFee: number;
  orderType: string;
  createdAt: number;
}

interface OrderStatusSuccessResponse {
  status: string;
  paid: boolean;
  underpaid: boolean;
  expired: boolean;
  tx: {
    commit: string;
    fees: number;
    inscription: string;
    reveal: string;
  };
  sent: string;
}

class OrdinalsbotClient {
  constructor(readonly baseUrl: string) {}

  async isAvailable() {
    return axios.get<{ status: string }>(urlJoin(this.baseUrl, 'status'));
  }

  async textInscription(text: string, receiveAddress: string) {
    return axios.post<TextInscriptionSuccessResponse>(urlJoin(this.baseUrl, 'textorder'), {
      receiveAddress,
      texts: [text],
    });
  }

  async orderStatus(id: string) {
    return axios.get<OrderStatusSuccessResponse>(urlJoin(this.baseUrl, 'order'), {
      params: { id },
    });
  }
}

function useOrdinalsbotApiUrl() {
  const currentNetwork = useCurrentNetwork();
  const ordinalsbotConfig = useConfigOrdinalsbot();

  if (currentNetwork.chain.bitcoin.network === 'mainnet') return ordinalsbotConfig.mainnetApiUrl;
  return ordinalsbotConfig.signetApiUrl;
}

// ts-unused-exports:disable-next-line
export function useOrdinalsbotClient() {
  const apiUrl = useOrdinalsbotApiUrl();
  return new OrdinalsbotClient(apiUrl);
}

// ts-unused-exports:disable-next-line
export function useBrc20FeatureFlag() {
  const currentNetwork = useCurrentNetwork();

  const ordinalsbotConfig = useConfigOrdinalsbot();

  if (!ordinalsbotConfig.integrationEnabled) {
    return { enabled: false, reason: 'BRC-20 transfers are temporarily disabled' } as const;
  }

  const supportedNetwork =
    currentNetwork.chain.bitcoin.network === 'mainnet' ||
    currentNetwork.chain.bitcoin.network === 'signet';

  if (!supportedNetwork) return { enabled: false, reason: 'Unsupported network' } as const;

  // TODO: Add api availability check

  return { enabled: true } as const;
}
