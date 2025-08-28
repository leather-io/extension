import { RouteUrls } from '@shared/route-urls';

import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { generateStacksRpcTransactionRequestRoutes } from '@app/features/rpc-stacks-transaction-request/stacks/stacks-rpc-transaction-request.routes';

import { RpcStxTransferSip9Nft } from './rpc-stx-transfer-sip9-nft';
import { RpcStxTransferSip9NftContainer } from './rpc-stx-transfer-sip9-nft-container';

export const rpcStxTransferSip9NftRoutes = generateStacksRpcTransactionRequestRoutes({
  path: RouteUrls.RpcStxTransferSip9Nft,
  container: (
    <CurrentStacksAccountLoader>
      {account => <RpcStxTransferSip9NftContainer account={account} />}
    </CurrentStacksAccountLoader>
  ),
  element: <RpcStxTransferSip9Nft />,
});
