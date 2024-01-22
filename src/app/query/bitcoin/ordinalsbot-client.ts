import { useMemo } from 'react';

import axios from 'axios';
import urlJoin from 'url-join';

import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useConfigOrdinalsbot } from '../common/remote-config/remote-config.query';

interface InscriptionOrderSuccessResponse {
  status: 'ok';
  receiveAddress: string;
  texts: string[];
  lowPostage: boolean;
  fee: number;
  files: {
    dataURL: string;
    name: string;
    size: number;
  }[];
  charge: {
    id: string;
    description: string;
    desc_hash: boolean;
    created_at: number;
    status: string;
    amount: number;
    callback_url: string;
    success_url: any;
    hosted_checkout_url: string;
    order_id: any;
    currency: string;
    source_fiat_value: number;
    fiat_value: number;
    auto_settle: boolean;
    notif_email: any;
    address: string;
    chain_invoice: {
      address: string;
    };
    uri: string;
    ttl: number;
    lightning_invoice: {
      expires_at: number;
      payreq: string;
    };
  };
  chainFee: number;
  serviceFee: number;
  baseFee: number;
  orderType: string;
  createdAt: {
    '.sv': string;
  };
}

interface InscriptionOrderArgs {
  file: string;
  receiveAddress: string;
  // in vbytes
  fee: number;
  // in bytes
  size: number;
  name: string;
}

interface OrderStatusSuccessResponse {
  status: string;
  paid: boolean;
  underpaid: boolean;
  expired: boolean;
  charge: {
    id: string;
    description: string;
    desc_hash: boolean;
    created_at: number;
    status: string;
    amount: number;
    callback_url: string;
    success_url: any;
    hosted_checkout_url: string;
    order_id: any;
    currency: string;
    source_fiat_value: number;
    fiat_value: number;
    auto_settle: boolean;
    notif_email: any;
    address: string;
    chain_invoice: {
      address: string;
    };
    uri: string;
    ttl: number;
    lightning_invoice: {
      expires_at: number;
      payreq: string;
    };
  };
  files: {
    dataURL: string;
    name: string;
    size: number;
    type: string;
    url: string;
    processing: boolean;

    tx?: {
      commit: string;
      fees: number;
      inscription: string;
      reveal: string;
    };
  }[];

  sent: string;
}

class OrdinalsbotClient {
  constructor(readonly baseUrl: string) {}

  async isAvailable() {
    return axios.get<{ status: string }>(urlJoin(this.baseUrl, 'status'));
  }

  async order({ receiveAddress, file, fee, size, name }: InscriptionOrderArgs) {
    return axios.post<InscriptionOrderSuccessResponse>(urlJoin(this.baseUrl, 'order'), {
      receiveAddress,
      files: [{ dataURL: file, size, name, type: 'plain/text' }],
      fee,
      lowPostage: true,
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

  if (currentNetwork.chain.bitcoin.bitcoinNetwork === 'mainnet')
    return ordinalsbotConfig.mainnetApiUrl;
  return ordinalsbotConfig.signetApiUrl;
}

export function useOrdinalsbotClient() {
  const apiUrl = useOrdinalsbotApiUrl();
  return useMemo(() => new OrdinalsbotClient(apiUrl), [apiUrl]);
}
