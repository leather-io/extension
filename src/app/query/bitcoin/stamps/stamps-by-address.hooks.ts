import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import {
  CryptoAssetCategories,
  CryptoAssetChains,
  CryptoAssetProtocols,
  Src20Asset,
} from '@leather.io/models';
import { Src20Token, createGetStampsByAddressQueryOptions } from '@leather.io/query';
import { createBaseCryptoAssetBalance, createMoney } from '@leather.io/utils';

function createSrc20Asset(src20: Src20Token): Src20Asset {
  return {
    chain: CryptoAssetChains.bitcoin,
    category: CryptoAssetCategories.fungible,
    protocol: CryptoAssetProtocols.src20,
    decimals: 0,
    hasMemo: false,
    id: src20.id ?? '',
    symbol: src20.tick,
    deploy_tx: src20.deploy_tx,
    deploy_img: src20.deploy_img,
  };
}

export function useStampsByAddress(address: string) {
  return useQuery({
    ...createGetStampsByAddressQueryOptions(address),
    select: resp => resp.data?.stamps,
  });
}
export function useSrc20TokensByAddress(address: string) {
  return useQuery({
    ...createGetStampsByAddressQueryOptions(address),
    select: resp =>
      resp.data.src20.map(token => ({
        balance: createBaseCryptoAssetBalance(
          createMoney(new BigNumber(token.amt ?? 0), token.tick, 0)
        ),
        info: createSrc20Asset(token),
      })),
  });
}
