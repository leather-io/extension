import { useQueries } from '@tanstack/react-query';
import axios from 'axios';

import { getHiroApiRateLimiter } from '@leather.io/query';

import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export interface StacksBlock {
  canonical: boolean;
  height: number;
  hash: string;
  block_time: number;
  block_time_iso: string;
  index_block_hash: string;
  parent_block_hash: string;
  parent_index_block_hash: string;
  burn_block_time: number;
  burn_block_time_iso: string;
  burn_block_hash: string;
  burn_block_height: number;
  miner_txid: string;
  tx_count: number;
  execution_cost_read_count: number;
  execution_cost_read_length: number;
  execution_cost_runtime: number;
  execution_cost_write_count: number;
  execution_cost_write_length: number;
}

async function getStacksBlock(basePath: string, block: number): Promise<StacksBlock> {
  const rateLimiter = getHiroApiRateLimiter(basePath);
  const resp = await rateLimiter.add(() => axios.get(`${basePath}/extended/v2/blocks/${block}`), {
    priority: 3,
    throwOnTimeout: true,
  });
  return resp.data;
}

function makeGetStacksBlockQuery(basePath: string, block: number) {
  return {
    queryKey: ['get-stacks-block', block],
    async queryFn() {
      return getStacksBlock(basePath, block);
    },
  };
}

export function useGetStacksBlocks(blocks: number[]) {
  const network = useCurrentNetwork();
  return useQueries({
    queries: blocks.map(block => makeGetStacksBlockQuery(network.chain.stacks.url, block)),
  });
}
